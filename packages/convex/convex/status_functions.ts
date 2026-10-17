import { v } from "convex/values";
import { staffQuery } from "./lib/wrappers";

export const getStatuses = staffQuery({
  args: {
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const statuses = await ctx.db
      .query("statuses")
      .withIndex("orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    return statuses;
  },
});
