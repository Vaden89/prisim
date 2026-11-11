import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCurrentUserFromCtx } from "./helpers/auth";
import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await getCurrentUserFromCtx(ctx);

    if (!user) {
      throw new ConvexError({
        code: "USER_NOT_FOUND",
        message: "Your account could not be found.",
      });
    }

    return { ctx: { user }, args };
  },
});

export const userQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const user = await getCurrentUserFromCtx(ctx);

    if (!user) {
      throw new ConvexError({
        code: "USER_NOT_FOUND",
        message: "Your account could not be found.",
      });
    }

    return { ctx: { user }, args };
  },
});

export const staffMutation = customMutation(mutation, {
  args: {
    orgId: v.id("organizations"),
  },
  input: async (ctx, args) => {
    const user = await getCurrentUserFromCtx(ctx);

    if (!user) {
      throw new ConvexError({
        code: "USER_NOT_FOUND",
        message: "Your account could not be found.",
      });
    }

    const staff = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", args.orgId).eq("userId", user._id),
      )
      .unique();

    if (!staff) {
      throw new ConvexError({
        code: "STAFF_NOT_FOUND",
        message: "You are not a member of this workspace.",
      });
    }

    return { ctx: { user, staff }, args };
  },
});

export const staffQuery = customQuery(query, {
  args: {
    orgId: v.id("organizations"),
  },
  input: async (ctx, args) => {
    const user = await getCurrentUserFromCtx(ctx);

    if (!user) {
      throw new ConvexError({
        code: "USER_NOT_FOUND",
        message: "Your account could not be found.",
      });
    }

    const staff = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", args.orgId).eq("userId", user._id),
      )
      .unique();

    if (!staff) {
      throw new ConvexError({
        code: "STAFF_NOT_FOUND",
        message: "You are not a member of this workspace.",
      });
    }

    return { ctx: { user, staff }, args };
  },
});
