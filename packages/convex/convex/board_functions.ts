import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

export const getBoards = query({
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

    const staff = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", args.orgId as Id<"organizations">).eq("userId", user._id),
      )
      .unique();

    if (!staff) {
      throw new ConvexError({
        code: "STAFF_NOT_FOUND",
        message: "You are not a staff of this organization",
      });
    }

    const boards = await ctx.db
      .query("boards")
      .withIndex("orgId", (q) =>
        q.eq("orgId", args.orgId as Id<"organizations">),
      )
      .collect();

    return boards;
  },
});

export const createBoard = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);

    if (!authUser) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be logged in to create a board",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", authUser._id))
      .unique();

    if (!user) {
      throw new ConvexError({
        code: "USER_NOT_FOUND",
        message: "User not found",
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
        message: "You are not a staff of this organization",
      });
    }

    const boardId = await ctx.db.insert("boards", {
      name: args.name,
      orgId: args.orgId as Id<"organizations">,
      description: args.description,
    });

    return boardId;
  },
});
