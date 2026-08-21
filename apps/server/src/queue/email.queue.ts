import { Queue } from "bullmq";

export const emailQueue = new Queue("email", {
  connection: {
    host: process.env.REDIS_URL ?? "127.0.0.1",
    port: process.env.REDIS_PORT ?? 6379,
    password: process.env.REDIS_PASSWORD ?? undefined,
  },
});
