import { Select, SelectItem } from "@repo/ui";
import { api } from "@repo/convex/api";
import { useQuery } from "convex/react";
import { useDashboard } from "@/contexts/dashboard-provider";

export function SwitchWorkspaceBtn() {
  const { org } = useDashboard();
  const orgId = org.id;

  const organizations = useQuery(api.org_functions.getOrganizations);

  const handleSelect = (value: string) => {};

  if (!organizations) return null;

  const activeOrg = organizations?.find((v) => v._id === orgId);

  return (
    <Select
      onValueChange={handleSelect}
      placeholder="Choose a workspace"
      value={organizations?.find((v) => v._id === orgId)?.name ?? ""}
      prefix={
        <div className="w-6 h-6 text-[15px] flex items-center justify-center rounded-full bg-outline-gray text-center">
          {activeOrg && <span>{activeOrg.name.slice(0, 2).toUpperCase()}</span>}
        </div>
      }
    >
      {organizations.map((org) => (
        <SelectItem key={org._id} value={org._id}>
          {org.name}
        </SelectItem>
      ))}
    </Select>
  );
}
