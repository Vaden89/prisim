import { api } from "./_generated/api";
import { roleValidator } from "./schema";
import { Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

export const invitationAction = action({
  args: {
    token: v.string(),
    workspaceId: v.id("organizations"),
    invitees: v.array(v.object({ email: v.string(), role: roleValidator })),
  },
  handler: async (ctx, args) => {
    const organization = await ctx.runQuery(api.org_functions.getOrganization, {
      orgId: args.workspaceId,
    });

    if (!organization) {
      throw new ConvexError({
        code: "ORGANIZATION_NOT_FOUND",
        message: "Organization not found, it has been disbabled or deleted",
      });
    }

    const invitations = await ctx.runMutation(
      api.invitation_functions.createInvitations,
      { workspaceId: args.workspaceId, invitees: args.invitees },
    );

    const serverUrl = process.env.SERVER_URL;

    if (!serverUrl) {
      throw new Error("SERVER_URL environment variable is not set");
    }

    try {
      const res = await fetch(`${serverUrl}/api/team/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${args.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orgName: organization.name, invitations }),
      });

      if (!res.ok) {
        throw new Error(`Send email request failed with ${res.status}`);
      }
    } catch (error) {
      console.error("FAILED TO SEND INVITATIONS TO EMAILS", error);
      await ctx.runMutation(api.invitation_functions.deleteInvitations, {
        invitationIds: invitations.map((invitation) => invitation.id),
      });
      throw new ConvexError({
        code: "INVITATION_SEND_FAILED",
        message: "Failed to send invitations, please try again.",
      });
    }
  },
});

export const getInvitations = query({
  args: {
    workspaceId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const invites = await ctx.db
      .query("invitations")
      .withIndex("orgId", (q) => q.eq("orgId", args.workspaceId))
      .collect();

    return invites;
  },
});

export const getInvitation = query({
  args: {
    invitationId: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_id", (q) =>
        q.eq("_id", args.invitationId as Id<"invitations">),
      )
      .first();

    if (!invitation) {
      return null;
    }

    const organization = await ctx.db.get(invitation.orgId);
    const isExpired = Date.parse(invitation.expiresAt) < Date.now();

    return { ...invitation, organization, isExpired };
  },
});

export const createInvitations = mutation({
  args: {
    workspaceId: v.id("organizations"),
    invitees: v.array(v.object({ email: v.string(), role: roleValidator })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const expiry = new Date(now + sevenDaysInMs);

    let invitations: { email: string; id: Id<"invitations"> }[] = [];

    for (const invitee of args.invitees) {
      const existingInvite = await ctx.db
        .query("invitations")
        .withIndex("org_email", (q) =>
          q.eq("orgId", args.workspaceId).eq("email", invitee.email),
        )
        .first();

      if (existingInvite) {
        throw new ConvexError({
          code: "EMAIL_ALREADY_INVITED",
          message: `Email ${invitee.email} has already been invited to this workspace.`,
        });
      }

      const invitationId = await ctx.db.insert("invitations", {
        orgId: args.workspaceId,
        email: invitee.email,
        role: invitee.role,
        expiresAt: String(expiry),
      });

      invitations.push({ email: invitee.email, id: invitationId });
    }

    return invitations;
  },
});

export const deleteInvitation = mutation({
  args: {
    invitationId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.invitationId as Id<"invitations">);
  },
});

export const deleteInvitations = mutation({
  args: {
    invitationIds: v.array(v.id("invitations")),
  },
  handler: async (ctx, args) => {
    for (const invitationId of args.invitationIds) {
      await ctx.db.delete(invitationId);
    }
  },
});

export const acceptInvitation = mutation({
  args: {
    invitationId: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId as Id<"invitations">);
    if (!invitation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "This invitation does not exist.",
      });
    }
    const invitationExpiresAt = Date.parse(invitation.expiresAt);

    if (invitationExpiresAt && invitationExpiresAt < Date.now()) {
      throw new ConvexError({
        code: "EXPIRED",
        message: "This invitation has expired.",
      });
    }

    const user = await ctx.runQuery(api.auth.getCurrentUser, {});

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to accept an invitation.",
      });
    }

    if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message:
          "This invitation was not meant for your account. It was meant for " +
          invitation.email +
          ".",
      });
    }

    const staff = ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", invitation.orgId).eq("userId", user._id),
      );

    if (staff) {
      throw new ConvexError({
        code: "ALREADY_STAFF",
        message: "You are already a staff member of this organization.",
      });
    }

    await ctx.db.insert("staff", {
      orgId: invitation.orgId,
      userId: user._id,
      role: invitation.role,
    });

    await ctx.db.delete("invitations", args.invitationId as Id<"invitations">);

    return invitation.orgId;
  },
});
