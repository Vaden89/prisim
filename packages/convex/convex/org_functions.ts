import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

const DEFAULT_STATUSES = [
  { name: "backlog", color: "#8D8D8D" },
  { name: "in-progress", color: "#1630DD" },
  { name: "completed", color: "#10B981" },
] as const;

export const createOrganization = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);

    if (!authUser) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to create a workspace.",
      });
    }

    if (args.name.trim().length === 0) {
      throw new ConvexError({
        code: "INVALID_NAME",
        message: "Workspace name can't be empty.",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", authUser._id))
      .unique();

    if (!user) {
      throw new ConvexError({
        code: "USER_NOT_FOUND",
        message: "Your account could not be found.",
      });
    }

    const orgId = await ctx.db.insert("organizations", { name: args.name });

    await ctx.db.insert("staff", {
      orgId,
      userId: user._id,
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

export const getOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);

    if (!authUser) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", authUser._id))
      .unique();

    if (!user) {
      return null;
    }

    const staffRecords = await ctx.db
      .query("staff")
      .withIndex("userId", (q) => q.eq("userId", user._id))
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

export const getOrganization = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);

    if (!authUser) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", authUser._id))
      .unique();

    if (!user) {
      return null;
    }

    const staff = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", args.orgId as Id<"organizations">).eq("userId", user._id),
      )
      .unique();

    if (!staff) {
      return null;
    }

    const org = await ctx.db.get(args.orgId as Id<"organizations">);

    if (!org) {
      return null;
    }

    return { ...org, role: staff.role };
  },
});

export const updateOrganization = mutation({
  args: {
    orgId: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);

    if (!authUser) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to update a workspace.",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", authUser._id))
      .unique();

    if (!user) {
      throw new ConvexError({
        code: "USER_NOT_FOUND",
        message: "Your account could not be found.",
      });
    }

    const staff = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", args.orgId as Id<"organizations">).eq("userId", user._id),
      )
      .unique();

    if (!staff) {
      throw new ConvexError({
        code: "STAFF_NOT_FOUND",
        message: "You are not a member of this organization.",
      });
    }

    if (staff.role !== "OWNER") {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Only the workspace owner can update these details.",
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

export const getOrgMembers = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);

    if (!authUser) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", authUser._id))
      .unique();

    if (!user) {
      return null;
    }

    const staffRecord = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", args.orgId as Id<"organizations">).eq("userId", user._id),
      )
      .unique();

    if (!staffRecord) {
      return null;
    }

    const orgStaff = await ctx.db
      .query("staff")
      .withIndex("orgId", (q) => q.eq("orgId", staffRecord.orgId))
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
