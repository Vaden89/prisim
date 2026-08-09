import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    boardId: v.string(),
    assignee: v.string(),
    status: v.string(),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);

    if (!authUser) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be logged in to create a task",
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

    const board = await ctx.db.get(args.boardId as Id<"boards">);

    if (!board) {
      throw new ConvexError({
        code: "BOARD_NOT_FOUND",
        message: "The selected board does not exist",
      });
    }

    const staff = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", board.orgId).eq("userId", user._id),
      )
      .unique();

    if (!staff) {
      throw new ConvexError({
        code: "STAFF_NOT_FOUND",
        message: "You are not a member of this organization",
      });
    }

    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      boardId: args.boardId as Id<"boards">,
      assignee: args.assignee as Id<"users">,
      creator: user._id,
      status: args.status as Id<"statuses">,
      priority: args.priority,
    });

    return taskId;
  },
});

export const getTasksByBoard = query({
  args: {
    boardId: v.string(),
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

    const board = await ctx.db.get(args.boardId as Id<"boards">);

    if (!board) {
      throw new ConvexError({
        code: "BOARD_NOT_FOUND",
        message: "The selected board does not exist",
      });
    }

    const staff = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", board.orgId).eq("userId", user._id),
      )
      .unique();

    if (!staff) {
      throw new ConvexError({
        code: "STAFF_NOT_FOUND",
        message: "You are not a member of this organization",
      });
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("boardId", (q) =>
        q.eq("boardId", args.boardId as Id<"boards">),
      )
      .collect();

    return tasks;
  },
});

export const getMyTasks = query({
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

    const assignedTasks = await ctx.db
      .query("tasks")
      .withIndex("assignee", (q) => q.eq("assignee", user._id))
      .collect();

    const createdTasks = await ctx.db
      .query("tasks")
      .withIndex("creator", (q) => q.eq("creator", user._id))
      .collect();

    const taskMap = new Map<string, (typeof assignedTasks)[number]>();

    for (const task of assignedTasks) {
      taskMap.set(task._id, task);
    }

    for (const task of createdTasks) {
      taskMap.set(task._id, task);
    }

    return Array.from(taskMap.values());
  },
});
