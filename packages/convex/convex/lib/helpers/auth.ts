import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "../../_generated/server";
import { authComponent } from "../../auth";

export const getCurrentUserFromCtx = async (ctx: QueryCtx | MutationCtx) => {
  const authUser = await authComponent.safeGetAuthUser(ctx);

  if (!authUser) {
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "You must be authenticated to perform this action."
    })
  }

  return await ctx.db
    .query("users")
    .withIndex("authId", (q) => q.eq("authId", authUser._id))
    .unique();
}
