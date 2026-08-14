import { createRemoteJWKSet, jwtVerify } from "jose";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { AuthEnv } from "../types/auth.types.js";

const siteUrl = process.env["CONVEX_SITE_URL"];

if (!siteUrl) {
  throw new Error("CONVEX_SITE_URL environment variable is not set");
}

const CONVEX_SITE_URL: string = siteUrl;

const jwks = createRemoteJWKSet(
  new URL(`${CONVEX_SITE_URL}/api/auth/convex/jwks`),
);

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  if (!token) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const { payload } = await jwtVerify(token, jwks, {
    issuer: CONVEX_SITE_URL,
    audience: "convex",
  });

  if (!payload.sub) {
    throw new HTTPException(401, {
      message: "Token is missing a subject claim",
    });
  }

  c.set("auth", { userId: payload.sub, token, claims: payload });

  await next();
});
