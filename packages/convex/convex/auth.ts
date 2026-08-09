import {
  createClient,
  type AuthFunctions,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import authConfig from "./auth.config";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";

const siteUrl = process.env.SITE_URL!;

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, authUser) => {
        const [firstName = "", ...rest] = (authUser.name ?? "")
          .trim()
          .split(" ");
        const userId = await ctx.db.insert("users", {
          authId: authUser._id,
          email: authUser.email,
          firstName,
          lastName: rest.join(" "),
        });
        await authComponent.setUserId(ctx, authUser._id, userId);
      },
      onDelete: async (ctx, authUser) => {
        const user = await ctx.db
          .query("users")
          .withIndex("authId", (q) => q.eq("authId", authUser._id))
          .unique();
        if (!user) return;
        const memberships = await ctx.db
          .query("staff")
          .withIndex("userId", (q) => q.eq("userId", user._id))
          .collect();
        for (const membership of memberships) {
          await ctx.db.delete(membership._id);
        }
        await ctx.db.delete(user._id);
      },
    },
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [convex({ authConfig })],
  });

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) return null;
    return ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", authUser._id))
      .unique();
  },
});
