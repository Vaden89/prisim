import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getSubTasks = query({
  args: {
    taskId: v.string(),
  },
  handler: async (ctx, args) => {
    const subTasks = await ctx.db
      .query("subTasks")
      .withIndex("taskId", (q) => q.eq("taskId", args.taskId as Id<"tasks">))
      .collect();

    return subTasks;
  },
});

export const createSubTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    taskId: v.string(),
  },
  handler: async (ctx, args) => {
    const { title, description, taskId } = args;
    const subTaskId = await ctx.db.insert("subTasks", {
      title,
      description,
      isCompleted: false,
      taskId: taskId as Id<"tasks">,
    });

    return subTaskId;
  },
});
