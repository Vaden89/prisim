import { api } from "@repo/convex/api";
import { FunctionReturnType } from "convex/server";

export type UserType = NonNullable<
  FunctionReturnType<typeof api.auth.getCurrentUser>
>;
