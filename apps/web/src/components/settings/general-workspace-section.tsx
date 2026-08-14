import { OrganizationDetailsCard } from "./cards/organization-details-card";

export function GeneralWorkspaceSection() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col">
      <div className="mt-10 space-y-1">
        <h1 className="text-[32px] tracking-[-4%] leading-[120%] font-medium">
          General Settings
        </h1>
        <p className="text-secondary leading-[120%] tracking-[-4%]">
          Manage your organization details and workspace perferences.
        </p>
      </div>
      <OrganizationDetailsCard />
    </div>
  );
}
