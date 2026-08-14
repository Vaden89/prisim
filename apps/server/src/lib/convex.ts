import { ConvexHttpClient } from "convex/browser";
import { api } from "@repo/convex/api";

const siteUrl = process.env["CONVEX_URL"];

if (!siteUrl) {
  throw new Error("CONVEX_URL environment variable is not set");
}

const convexUrl: string = siteUrl;

function getConvexClient(token: string) {
  const client = new ConvexHttpClient(convexUrl);
  client.setAuth(token);
  return client;
}

export const createSubTask = async (
  token: string,
  taskId: string,
  title: string,
  description: string,
) => {
  await getConvexClient(token).mutation(api.sub_task_functions.createSubTask, {
    taskId,
    title,
    description,
  });
};

export const updateTask = async (
  token: string,
  isReasoning: boolean,
  taskId: string,
) => {
  await getConvexClient(token).mutation(api.task_functions.updateTask, {
    isReasoning,
    taskId,
  });
};
