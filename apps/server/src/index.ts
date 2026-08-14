import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import blastRadiusRouter from "./routes/blast-radius.js";
import { closePool } from "./lib/db.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env["CORS_ORIGIN"] ?? "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.get("/", (c) => c.json({ status: "ok" }));
app.route("/api/blast-radius", blastRadiusRouter);

const port = Number(process.env["PORT"] ?? 3001);

const server = serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}`);
});

function shutdown() {
  server.close(() => {
    closePool();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;
