"use client";
import { useSearchParams } from "next/navigation";
import { UserProfileSection } from "@/components/settings/user-profile-section";
import { GeneralWorkspaceSection } from "@/components/settings/general-workspace-section";
import { TeamMemberSection } from "@/components/settings/team-member-section";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("active-section") ?? "profile";

  return (
    <div className="w-full h-full">
      {activeSection === "profile" && <UserProfileSection />}
      {activeSection === "workspace" && <GeneralWorkspaceSection />}
      {activeSection === "team-members" && <TeamMemberSection />}
    </div>
  );
}
