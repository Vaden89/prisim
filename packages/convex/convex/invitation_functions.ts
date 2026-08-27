import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { Role, roleValidator } from "./schema";
import { ConvexError, v } from "convex/values";
import {
  action,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";

async function requireOrgRole(
  ctx: QueryCtx | MutationCtx,
  orgId: Id<"organizations">,
  allowed: Role[],
) {
  const user = await ctx.runQuery(api.auth.getCurrentUser, {});

  if (!user) {
    throw new ConvexError({
      code: "USER_NOT_FOUND",
      message: "Your account could not be found.",
    });
  }

  const membership = await ctx.db
    .query("staff")
    .withIndex("org_user", (q) => q.eq("orgId", orgId).eq("userId", user._id))
    .unique();

  if (!membership || !allowed.includes(membership.role)) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message:
        "You don't have permission to manage invitations for this workspace.",
    });
  }

  return { user, membership };
}

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
        message: "Organization not found, it has been disabled or deleted",
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
    await requireOrgRole(ctx, args.workspaceId, ["OWNER", "ADMIN"]);

    const invites = await ctx.db
      .query("invitations")
      .withIndex("orgId", (q) => q.eq("orgId", args.workspaceId))
      .collect();

    return invites.map(({ token: _token, ...rest }) => rest);
  },
});

export const getInvitation = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      return null;
    }

    const organization = await ctx.db.get(invitation.orgId);
    const isExpired = Date.parse(invitation.expiresAt) < Date.now();

    const { token: _token, ...safe } = invitation;
    return { ...safe, organization, isExpired };
  },
});

export const createInvitations = mutation({
  args: {
    workspaceId: v.id("organizations"),
    invitees: v.array(v.object({ email: v.string(), role: roleValidator })),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireOrgRole(ctx, args.workspaceId, [
      "OWNER",
      "ADMIN",
    ]);

    const now = Date.now();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const expiry = new Date(now + sevenDaysInMs);

    const invitations: {
      email: string;
      id: Id<"invitations">;
      token: string;
    }[] = [];

    for (const invitee of args.invitees) {
      const email = invitee.email.trim().toLowerCase();
      if (membership.role === "ADMIN" && invitee.role !== "DEFAULT") {
        throw new ConvexError({
          code: "FORBIDDEN_ROLE",
          message:
            "Admins can only invite members. Ask an owner to assign elevated roles.",
        });
      }

      const existingUser = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", email))
        .unique();

      if (existingUser) {
        const existingStaff = await ctx.db
          .query("staff")
          .withIndex("org_user", (q) =>
            q.eq("orgId", args.workspaceId).eq("userId", existingUser._id),
          )
          .unique();

        if (existingStaff) {
          throw new ConvexError({
            code: "ALREADY_MEMBER",
            message: `${email} is already a member of this workspace.`,
          });
        }
      }

      const existingInvite = await ctx.db
        .query("invitations")
        .withIndex("org_email", (q) =>
          q.eq("orgId", args.workspaceId).eq("email", email),
        )
        .first();

      if (existingInvite) {
        const isExpired = Date.parse(existingInvite.expiresAt) < now;

        if (!isExpired) {
          throw new ConvexError({
            code: "EMAIL_ALREADY_INVITED",
            message: `Email ${email} has already been invited to this workspace.`,
          });
        }

        await ctx.db.delete(existingInvite._id);
      }

      const token = crypto.randomUUID() + crypto.randomUUID();
      const invitationId = await ctx.db.insert("invitations", {
        orgId: args.workspaceId,
        email,
        token,
        role: invitee.role,
        expiresAt: String(expiry),
      });

      invitations.push({ email, id: invitationId, token });
    }

    return invitations;
  },
});

export const deleteInvitation = mutation({
  args: {
    invitationId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = args.invitationId as Id<"invitations">;
    const invitation = await ctx.db.get(id);

    if (!invitation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "This invitation no longer exists.",
      });
    }

    await requireOrgRole(ctx, invitation.orgId, ["OWNER", "ADMIN"]);
    await ctx.db.delete(id);
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
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "This invitation does not exist.",
      });
    }

    const invitationExpiresAt = Date.parse(invitation.expiresAt);

    if (invitationExpiresAt && invitationExpiresAt < Date.now()) {
      throw new ConvexError({
        code: "INVITE_EXPIRED",
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

    const staff = await ctx.db
      .query("staff")
      .withIndex("org_user", (q) =>
        q.eq("orgId", invitation.orgId).eq("userId", user._id),
      )
      .unique();

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

    await ctx.db.delete(invitation._id);

    return invitation.orgId;
  },
});
