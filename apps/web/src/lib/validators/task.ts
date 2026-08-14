import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required"),
  description: z.string().trim().min(1, "Task description is required"),
  boardId: z.string().min(1, "Please select a board"),
  status: z.string().min(1, "Please select a status"),
  priority: z.string().min(1, "Please select a priority"),
  assignee: z.string().min(1, "Please select an assignee"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required"),
  description: z.string().trim().min(1, "Task description is required"),
  status: z.string().min(1, "Please select a status"),
  priority: z.string().min(1, "Please select a priority"),
  assignee: z.string().min(1, "Please select an assignee"),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
