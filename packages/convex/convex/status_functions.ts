import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

export const getStatuses = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);

    if (!authUser) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to carry out this action",
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
        message: "You are not a staff member of this organization.",
      });
    }

    const statuses = await ctx.db
      .query("statuses")
      .withIndex("orgId", (q) =>
        q.eq("orgId", args.orgId as Id<"organizations">),
      )
      .collect();

    return statuses;
  },
});
