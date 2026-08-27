import { Hono } from "hono";
import { getEnv } from "../env.js";
import { render } from "hono-email";
import { AuthEnv } from "../types/auth.types.js";
import { requireAuth } from "../middleware/auth.js";
import { emailQueue } from "../queue/email.queue.js";
import InviteToWorkspaceEmail from "../emails/invite-to-workspace.js";

const teamRouter = new Hono<AuthEnv>();
teamRouter.use(requireAuth);

teamRouter.post("/invite", async (c) => {
  const env = getEnv(c);
  const { FRONTEND_URL } = env;
  const { orgName, invitations } = await c.req.json();

  await Promise.all(
    invitations.map(async (invitee: { token: string; email: string }) => {
      const { html, text } = await render(
        <InviteToWorkspaceEmail
          workspaceName={orgName}
          inviteUrl={`${FRONTEND_URL}/invite/${invitee.token}`}
        />,
      );

      await emailQueue.add("email", {
        to: invitee.email,
        html,
        text,
        subject: `Invitation to ${orgName} workspace on Prism`,
      });
    }),
  );

  return c.json({ message: "Invites sent successfully" }, 200);
});

export default teamRouter;
