import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roleValidator = v.union(
  v.literal("ADMIN"),
  v.literal("OWNER"),
  v.literal("DEFAULT"),
);
export type Role = typeof roleValidator.type;

export default defineSchema({
  users: defineTable({
    authId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
  })
    .index("authId", ["authId"])
    .index("email", ["email"]),

  organizations: defineTable({
    name: v.string(),
  }),

  staff: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    role: roleValidator,
  })
    .index("orgId", ["orgId"])
    .index("userId", ["userId"])
    .index("org_user", ["orgId", "userId"]),

  boards: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    orgId: v.id("organizations"),
  }).index("orgId", ["orgId"]),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    boardId: v.id("boards"),
    assignee: v.id("users"),
    status: v.id("statuses"),
  }).index("boardId", ["boardId"]),

  statuses: defineTable({
    name: v.string(),
    color: v.string(),
    orgId: v.id("organizations"),
  }).index("orgId", ["orgId"]),
});
