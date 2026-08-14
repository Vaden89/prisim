import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { AuthEnv } from "../types/auth.types.js";
import { blastRadiusAgent } from "../lib/agent.js";
import { createSubTask, updateTask } from "../lib/convex.js";

const blastRadiusRouter = new Hono<AuthEnv>();
blastRadiusRouter.use(requireAuth);

async function runBlastRadius(task: string, taskId: string, token: string) {
  try {
    const { report } = await blastRadiusAgent(task);

    if (report.subTasks) {
      for (const subTask of report.subTasks) {
        await createSubTask(token, taskId, subTask.title, subTask.description);
      }
    }
  } catch (error) {
    console.error("Blast-radius analysis failed", error);
  } finally {
    await updateTask(token, false, taskId);
  }
}

blastRadiusRouter.post("/", async (c) => {
  const { task, taskId } = await c.req.json();
  const { token } = c.get("auth");

  void runBlastRadius(task, taskId, token);

  return c.json({ message: "Analysis started" }, 202);
});

export default blastRadiusRouter;
