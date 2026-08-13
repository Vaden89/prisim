import { env } from "hono/adapter";
import type { Context } from "hono";

export type Env = {
  PORT: string;
  CORS_ORIGIN: string;
  CONVEX_SITE_URL: string;
  POSTGRES_URL: string;
  VOYAGE_API_KEY: string;
};

export function getEnv(c: Context) {
  return env<Env>(c);
}
