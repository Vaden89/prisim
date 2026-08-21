"use client";
import { useSearchParams } from "next/navigation";
import { UserProfileSection } from "@/components/settings/user-profile-section";
import { GeneralWorkspaceSection } from "@/components/settings/general-workspace-section";
import { TeamMemberSection } from "@/components/settings/team-member-section";
import { CodebaseIntegrationSection } from "@/components/settings/codebase-integration-section";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("active-section") ?? "profile";

  return (
    <div className="w-full h-full">
      {activeSection === "profile" && <UserProfileSection />}
      {activeSection === "team-members" && <TeamMemberSection />}
      {activeSection === "workspace" && <GeneralWorkspaceSection />}
      {activeSection === "integrations" && <CodebaseIntegrationSection />}
    </div>
  );
}
