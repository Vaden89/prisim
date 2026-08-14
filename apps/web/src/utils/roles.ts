import { OrgMember } from "@/types/organization.type";

export const roleBadgeClasses: Record<OrgMember["role"], string> = {
  OWNER: "bg-primary/10 text-primary border-primary/20",
  ADMIN: "bg-success/10 text-success border-success/20",
  DEFAULT: "bg-light-gray/10 text-secondary border-light-gray/10",
};

export const roleLabels: Record<OrgMember["role"], string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  DEFAULT: "Member",
};
