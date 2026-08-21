import { env } from "hono/adapter";
import type { Context } from "hono";

export type Env = {
  PORT: string;
  REDIS_URL: string;
  REDIS_PORT: number;
  CONVEX_URL: string;
  CORS_ORIGIN: string;
  POSTGRES_URL: string;
  FRONTEND_URL: string;
  VOYAGE_API_KEY: string;
  CONVEX_SITE_URL: string;
  SENDLIB_API_KEY: string;
  AI_GATEWAY_API_KEY: string;
  REDIS_PASSWORD: string | undefined;
};

export function getEnv(c: Context) {
  return env<Env>(c);
}
