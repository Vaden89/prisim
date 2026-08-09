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
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", authUser._id))
      .unique();

    if (!user) {
      return [];
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

export const getOrgMembers = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);

    if (!authUser) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", authUser._id))
      .unique();

    if (!user) {
      return [];
    }

    const staffRecord = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", args.orgId as Id<"organizations">).eq("userId", user._id),
      )
      .unique();

    if (!staffRecord) {
      return [];
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
          role: s.role,
        };
      }),
    );

    return members.filter((m) => m !== null);
  },
});
