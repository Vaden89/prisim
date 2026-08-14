import { api } from "@repo/convex/api";
import { FunctionReturnType } from "convex/server";

export type TaskType = NonNullable<
  FunctionReturnType<typeof api.task_functions.getTask>
>;
