import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { staffMutation, staffQuery } from "./lib/wrappers";

export const getBoards = staffQuery({
  args: {
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const boards = await ctx.db
      .query("boards")
      .withIndex("orgId", (q) =>
        q.eq("orgId", args.orgId as Id<"organizations">),
      )
      .collect();

    const boardsWithTaskCount = await Promise.all(
      boards.map(async (board) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("boardId", (q) => q.eq("boardId", board._id))
          .collect();

        return { ...board, taskCount: tasks.length };
      }),
    );

    return boardsWithTaskCount;
  },
});

export const getBoardWithTasks = staffQuery({
  args: {
    boardId: v.string(),
  },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.boardId as Id<"boards">);

    if (!board) {
      return null;
    }

    if (board.orgId !== args.orgId) {
      throw new ConvexError({
        code: "RESOURCE_NOT_IN_ORGANIZATION",
        message: "The selected board does not belong to this organization",
      });
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("boardId", (q) => q.eq("boardId", board._id))
      .order("desc")
      .collect();

    const populatedTasks = await Promise.all(
      tasks.map(async (task) => {
        const [assignee, status] = await Promise.all([
          ctx.db.get(task.assignee),
          ctx.db.get(task.status),
        ]);

        return {
          ...task,
          assignee: assignee
            ? {
                _id: assignee._id,
                firstName: assignee.firstName,
                lastName: assignee.lastName,
              }
            : null,
          status: status
            ? { _id: status._id, name: status.name, color: status.color }
            : null,
        };
      }),
    );

    return { ...board, tasks: populatedTasks };
  },
});

export const createBoard = staffMutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const boardId = await ctx.db.insert("boards", {
      name: args.name,
      orgId: args.orgId as Id<"organizations">,
      description: args.description,
    });

    return boardId;
  },
});
