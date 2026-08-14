import { env } from "hono/adapter";
import type { Context } from "hono";

export type Env = {
  PORT: string;
  CORS_ORIGIN: string;
  POSTGRES_URL: string;
  VOYAGE_API_KEY: string;
  CONVEX_URL: string;
  CONVEX_SITE_URL: string;
  AI_GATEWAY_API_KEY: string;
};

export function getEnv(c: Context) {
  return env<Env>(c);
}
