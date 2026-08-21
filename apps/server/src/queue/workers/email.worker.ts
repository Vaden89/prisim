import { Job, Worker } from "bullmq";

interface EmailJobData {
  to: string;
  html: string;
  text: string;
  subject: string;
}

const connection = {
  host: process.env.REDIS_URL ?? "127.0.0.1",
  port: process.env.REDIS_PORT ?? 6379,
  password: process.env.REDIS_PASSWORD ?? undefined,
};

const worker = new Worker(
  "email",
  async (job: Job<EmailJobData>) => {
    const SENDLIB_API_KEY = process.env.SENDLIB_API_KEY;
    const { to, html, text, subject } = job.data;

    void (await fetch("https://sendlib.samueltuoyo.com/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SENDLIB_API_KEY}`,
      },
      body: JSON.stringify({
        from: "isaacshosanya89@gmail.com",
        to,
        subject,
        text,
        html,
      }),
    }));
  },
  { connection },
);

worker.on("completed", (job: Job<EmailJobData>) => {
  console.log("EMAIL SENT TO", job.data.to);
});
