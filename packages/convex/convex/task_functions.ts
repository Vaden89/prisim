import { authComponent } from "./auth";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { staffMutation, staffQuery } from "./lib/wrappers";

export const createTask = mutation({
  args: {
    orgId: v.id("organizations"),
    title: v.string(),
    description: v.string(),
    boardId: v.string(),
    assignee: v.string(),
    status: v.string(),
    priority: v.string(),
    isReasoning: v.optional(v.boolean()),
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

    if (board.orgId !== args.orgId) {
      throw new ConvexError({
        code: "RESOURCE_NOT_IN_ORGANIZATION",
        message: "The selected board does not belong to this organization",
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

    const assignee = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", board.orgId).eq("userId", args.assignee as Id<"users">),
      )
      .unique();

    if (!assignee) {
      throw new ConvexError({
        code: "ASSIGNEE_NOT_FOUND",
        message: "The selected assignee is not a member of this organization",
      });
    }

    const status = await ctx.db.get(args.status as Id<"statuses">);

    if (!status || status.orgId !== board.orgId) {
      throw new ConvexError({
        code: "STATUS_NOT_FOUND",
        message: "The selected status does not belong to this organization",
      });
    }

    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      boardId: args.boardId as Id<"boards">,
      assignee: args.assignee as Id<"users">,
      creator: user._id,
      status: status._id,
      priority: args.priority,
      isReasoning: args.isReasoning ?? false,
    });

    return taskId;
  },
});

export const createTaskWithAnalysis = action({
  args: {
    orgId: v.id("organizations"),
    title: v.string(),
    description: v.string(),
    boardId: v.string(),
    assignee: v.string(),
    status: v.string(),
    priority: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"tasks">> => {
    const { token, ...taskArgs } = args;

    // Check if the org id passed is the same as the org that owns the board

    const taskId: Id<"tasks"> = await ctx.runMutation(
      api.task_functions.createTask,
      { ...taskArgs, isReasoning: true },
    );

    const serverUrl = process.env.SERVER_URL;

    if (!serverUrl) {
      throw new Error("SERVER_URL environment variable is not set");
    }

    try {
      const res = await fetch(`${serverUrl}/api/blast-radius`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task: `${taskArgs.title}\n\n${taskArgs.description}`,
          taskId,
          orgId: taskArgs.orgId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Blast-radius request failed with ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to trigger blast-radius analysis", error);
      await ctx.runMutation(api.task_functions.updateTask, {
        taskId,
        orgId: taskArgs.orgId as Id<"organizations">,
        isReasoning: false,
      });
    }

    return taskId;
  },
});

export const getTasksByBoard = staffQuery({
  args: {
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.boardId as Id<"boards">);

    if (!board) {
      throw new ConvexError({
        code: "BOARD_NOT_FOUND",
        message: "The selected board does not exist",
      });
    }

    if (board.orgId !== args.orgId) {
      throw new ConvexError({
        code: "RESOURCE_NOT_IN_ORGANIZATION",
        message: "The selected board does not belong to this organization",
      });
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("boardId", (q) =>
        q.eq("boardId", args.boardId as Id<"boards">),
      )
      .order("desc")
      .collect();

    return tasks;
  },
});

export const getTask = staffQuery({
  args: {
    taskId: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId as Id<"tasks">);

    if (!task) {
      throw new ConvexError({
        code: "TASK_NOT_FOUND",
        message: "This task does not exist",
      });
    }

    const board = await ctx.db.get(task.boardId);

    if (!board) {
      throw new ConvexError({
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      });
    }

    if (board.orgId !== args.orgId) {
      throw new ConvexError({
        code: "RESOURCE_NOT_IN_ORGANIZATION",
        message: "This task does not belong to the selected organization",
      });
    }

    const [assignee, creator, status] = await Promise.all([
      ctx.db.get(task.assignee),
      ctx.db.get(task.creator),
      ctx.db.get(task.status),
    ]);

    return {
      ...task,
      board: { _id: board._id, name: board.name, orgId: board.orgId },
      assignee: assignee
        ? {
            _id: assignee._id,
            firstName: assignee.firstName,
            lastName: assignee.lastName,
          }
        : null,
      creator: creator
        ? {
            _id: creator._id,
            firstName: creator.firstName,
            lastName: creator.lastName,
          }
        : null,
      status: status
        ? { _id: status._id, name: status.name, color: status.color }
        : null,
    };
  },
});

export const updateTask = staffMutation({
  args: {
    taskId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assignee: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    isReasoning: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId as Id<"tasks">);

    if (!task) {
      throw new ConvexError({
        code: "TASK_NOT_FOUND",
        message: "The task you are trying to update does not exist",
      });
    }

    const board = await ctx.db.get(task.boardId);

    if (!board) {
      throw new ConvexError({
        code: "BOARD_NOT_FOUND",
        message: "The board for this task does not exist",
      });
    }

    if (board.orgId !== args.orgId) {
      throw new ConvexError({
        code: "RESOURCE_NOT_IN_ORGANIZATION",
        message: "This task does not belong to the selected organization",
      });
    }

    const patch: Partial<{
      title: string;
      description: string;
      assignee: Id<"users">;
      status: Id<"statuses">;
      priority: string;
      isReasoning: boolean;
    }> = {};

    if (args.title !== undefined) patch.title = args.title;
    if (args.description !== undefined) patch.description = args.description;
    if (args.assignee !== undefined) {
      const assignee = await ctx.db
        .query("staff")
        .withIndex("org_user", (q) =>
          q.eq("orgId", board.orgId).eq("userId", args.assignee as Id<"users">),
        )
        .unique();

      if (!assignee) {
        throw new ConvexError({
          code: "ASSIGNEE_NOT_FOUND",
          message: "The selected assignee is not a member of this organization",
        });
      }
      patch.assignee = args.assignee as Id<"users">;
    }
    if (args.status !== undefined) {
      const status = await ctx.db.get(args.status as Id<"statuses">);

      if (!status || status.orgId !== board.orgId) {
        throw new ConvexError({
          code: "STATUS_NOT_FOUND",
          message: "The selected status does not belong to this organization",
        });
      }

      patch.status = status._id;
    }
    if (args.priority !== undefined) patch.priority = args.priority;
    if (args.isReasoning !== undefined) patch.isReasoning = args.isReasoning;

    await ctx.db.patch(task._id, patch);
  },
});

export const getMyTasks = staffQuery({
  args: {
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const assignedTasks = await ctx.db
      .query("tasks")
      .withIndex("assignee", (q) => q.eq("assignee", ctx.user._id))
      .collect();

    const createdTasks = await ctx.db
      .query("tasks")
      .withIndex("creator", (q) => q.eq("creator", ctx.user._id))
      .collect();

    const taskMap = new Map<string, (typeof assignedTasks)[number]>();

    for (const task of assignedTasks) {
      taskMap.set(task._id, task);
    }

    for (const task of createdTasks) {
      taskMap.set(task._id, task);
    }

    const tasks = Array.from(taskMap.values());

    const tasksWithRelationships = await Promise.all(
      tasks.map(async (task) => {
        const board = await ctx.db.get(task.boardId);

        if (!board || board.orgId !== args.orgId) {
          return null;
        }

        const status = await ctx.db.get(task.status);

        return {
          ...task,
          board: { _id: board._id, name: board.name, orgId: board.orgId },
          status: status
            ? { _id: status._id, name: status.name, color: status.color }
            : null,
        };
      }),
    );

    const validTasks = tasksWithRelationships.filter(
      (task): task is NonNullable<typeof task> => task !== null,
    );

    return validTasks.sort((a, b) => b._creationTime - a._creationTime);
  },
});
