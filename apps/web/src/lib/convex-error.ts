import { ConvexError } from "convex/values";

export type AppErrorData = {
  code: string;
  message: string;
};

const isAppErrorData = (data: unknown): data is AppErrorData =>
  typeof data === "object" &&
  data !== null &&
  "message" in data &&
  typeof (data as Record<string, unknown>).message === "string";

export const getConvexErrorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (err instanceof ConvexError) {
    if (isAppErrorData(err.data)) return err.data.message;
    if (typeof err.data === "string") return err.data;
  }
  return fallback;
};
