import { Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import {
  staffMutation,
  staffQuery,
  userMutation,
  userQuery,
} from "./lib/wrappers";

const DEFAULT_STATUSES = [
  { name: "backlog", color: "#8D8D8D" },
  { name: "in-progress", color: "#1630DD" },
  { name: "completed", color: "#10B981" },
] as const;

export const createOrganization = userMutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.name.trim().length === 0) {
      throw new ConvexError({
        code: "INVALID_NAME",
        message: "Workspace name can't be empty.",
      });
    }

    const existing = await ctx.db
      .query("organizations")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new ConvexError({
        code: "SLUG_TAKEN",
        message: "A workspace with this URL already exists.",
      });
    }

    const orgId = await ctx.db.insert("organizations", {
      name: args.name.trim(),
      slug: args.slug?.trim(),
    });

    await ctx.db.insert("staff", {
      orgId,
      userId: ctx.user._id,
      role: "OWNER",
    });

    for (const status of DEFAULT_STATUSES) {
      await ctx.db.insert("statuses", {
        name: status.name,
        color: status.color,
        orgId,
      });
    }

    return orgId;
  },
});

export const getOrganizations = userQuery({
  args: {},
  handler: async (ctx, args) => {
    const staffRecords = await ctx.db
      .query("staff")
      .withIndex("userId", (q) => q.eq("userId", ctx.user._id))
      .collect();

    const organizations = await Promise.all(
      staffRecords.map(async (record) => {
        const org = await ctx.db.get(record.orgId);
        return org ? { _id: org._id, name: org.name, role: record.role } : null;
      }),
    );

    return organizations.filter((org) => org !== null);
  },
});

export const getOrganization = staffQuery({
  args: {},
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.orgId as Id<"organizations">);

    if (!org) {
      throw new ConvexError({
        code: "ORG_NOT_FOUND",
        message: "The organization could not be found.",
      });
    }

    return { ...org, role: ctx.staff.role };
  },
});

export const updateOrganization = staffMutation({
  args: {
    orgId: v.id("organizations"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (ctx.staff.role !== "OWNER") {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Only the owner can update this workspace.",
      });
    }

    const org = await ctx.db.get(args.orgId as Id<"organizations">);

    if (!org) {
      throw new ConvexError({
        code: "ORGANIZATION_NOT_FOUND",
        message: "This workspace does not exist.",
      });
    }

    if (args.name !== undefined && args.name.trim().length === 0) {
      throw new ConvexError({
        code: "INVALID_NAME",
        message: "Workspace name can't be empty.",
      });
    }

    const patch: Partial<{ name: string; description: string }> = {};

    if (args.name !== undefined) patch.name = args.name;
    if (args.description !== undefined) patch.description = args.description;

    await ctx.db.patch(org._id, patch);
  },
});

export const getOrgMembers = staffQuery({
  args: {
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const orgStaff = await ctx.db
      .query("staff")
      .withIndex("orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const members = await Promise.all(
      orgStaff.map(async (s) => {
        const member = await ctx.db.get(s.userId);
        if (!member) return null;
        return {
          value: member._id,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          role: s.role,
          joinedAt: s._creationTime,
        };
      }),
    );

    return members.filter((m) => m !== null);
  },
});
