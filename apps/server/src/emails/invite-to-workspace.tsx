import { Body, Html, Img, LinkButton, Text } from "hono-email";

type InviteToWorkspaceEmailProps = {
  workspaceName: string;
  inviteUrl: string;
  inviterName?: string;
  productPreviewUrl?: string;
};

export default function InviteToWorkspaceEmail({
  workspaceName,
  inviteUrl,
  inviterName = "A teammate",
  productPreviewUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
}: InviteToWorkspaceEmailProps) {
  return (
    <Html>
      <Body style={styles.body}>
        <div style={styles.card}>
          <div style={styles.logoContainer}>
            <Img
              alt="Prism Logo"
              style={styles.logo}
              src="https://i.ibb.co/g8M2R7f/svgviewer-output-1.png"
            />
          </div>

          <Text style={styles.heading}>
            {inviterName} has invited you to the {workspaceName} team!
          </Text>

          <Text style={styles.paragraph}>
            Join the {workspaceName} workspace on Prism. Accept the invitation
            to start collaborating and tracking issues.
          </Text>

          <div style={styles.buttonContainer}>
            <LinkButton href={inviteUrl} style={styles.button}>
              Accept invitation
            </LinkButton>
          </div>

          <div style={styles.divider} />

          <Text style={styles.sectionHeading}>
            Intelligent task management and codebase impact analysis for
            engineering teams
          </Text>

          <div style={styles.imageContainer}>
            <Img
              src={productPreviewUrl}
              alt="Prism Product Preview"
              style={styles.featureImage}
            />
          </div>

          <Text style={styles.featureDescription}>
            Prism combines intuitive Kanban boards with AI-driven codebase
            reasoning. It automatically analyzes tasks against your codebase to
            map downstream impacts, surface dependencies, and create relevant
            sub-tasks before implementation begins.
          </Text>

          <div style={styles.footerDivider} />

          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Prism. If you did not expect this
            invitation, you can safely ignore this email.
          </Text>
        </div>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#020203",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: "0 auto",
    padding: "40px 16px",
    color: "#f6f6f6",
  },
  card: {
    backgroundColor: "#101113",
    border: "1px solid #1f2024",
    borderRadius: "12px",
    maxWidth: "560px",
    margin: "0 auto",
    padding: "40px 32px",
    boxSizing: "border-box" as const,
  },
  logoContainer: {
    marginBottom: "32px",
  },
  logo: {
    height: "56px",
    width: "auto",
    display: "block",
  },
  heading: {
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: "700",
    color: "#f6f6f6",
    margin: "0 0 16px 0",
    letterSpacing: "-0.32px",
  },
  paragraph: {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#9e9da4",
    margin: "0 0 28px 0",
  },
  buttonContainer: {
    marginBottom: "36px",
  },
  button: {
    backgroundColor: "#1630dd",
    color: "#f6f6f6",
    fontSize: "14px",
    fontWeight: "600",
    padding: "12px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    display: "inline-block",
  },
  divider: {
    borderTop: "1px solid #1c1d22",
    margin: "32px 0",
  },
  sectionHeading: {
    fontSize: "17px",
    lineHeight: "25px",
    fontWeight: "600",
    color: "#f6f6f6",
    margin: "0 0 20px 0",
    letterSpacing: "-0.16px",
  },
  imageContainer: {
    width: "100%",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #1c1d22",
    marginBottom: "20px",
    backgroundColor: "#020203",
  },
  featureImage: {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: "8px",
  },
  featureDescription: {
    fontSize: "13.5px",
    lineHeight: "22px",
    color: "#636169",
    margin: "0 0 28px 0",
  },
  footerDivider: {
    borderTop: "1px solid #1c1d22",
    margin: "24px 0 20px 0",
  },
  footerText: {
    fontSize: "12px",
    lineHeight: "18px",
    color: "#636169",
    margin: 0,
    textAlign: "center" as const,
  },
};
