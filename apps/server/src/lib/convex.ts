import { ConvexHttpClient } from "convex/browser";
import { api } from "@repo/convex/api";

const siteUrl = process.env["CONVEX_SITE_URL"];

if (!siteUrl) {
  throw new Error("CONVEX_SITE_URL environment variable is not set");
}

const convexClient = new ConvexHttpClient(siteUrl);

export const createSubTask = async (
  taskId: string,
  title: string,
  description: string,
) => {
  await convexClient.mutation(api.sub_task_functions.createSubTask, {
    taskId,
    title,
    description,
  });
};
