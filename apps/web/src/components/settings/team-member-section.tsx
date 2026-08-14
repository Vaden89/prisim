"use client";

import {
  Table,
  TableSkeleton,
  type TableColumn,
} from "@/components/common/table";
import { cn } from "@repo/ui";
import { api } from "@repo/convex/api";
import { useQuery } from "convex/react";
import { formatDate } from "@/utils/date";
import { OrgMember } from "@/types/organization.type";
import { roleBadgeClasses, roleLabels } from "@/utils/roles";
import { useDashboard } from "@/contexts/dashboard-provider";
import { InviteNewMembersCard } from "./cards/invite-new-memebers.card";

export function TeamMemberSection() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col">
      <div className="mt-10 space-y-1">
        <h1 className="text-[32px] tracking-[-4%] leading-[120%] font-medium">
          Team Members
        </h1>
        <p className="text-secondary leading-[120%] tracking-[-4%]">
          Manage workspace seats, member permissions and pending invitations.
        </p>
      </div>
      <InviteNewMembersCard />
      <ActiveMembersSection />
    </div>
  );
}

function ActiveMembersSection() {
  const { org } = useDashboard();
  const members = useQuery(api.org_functions.getOrgMembers, { orgId: org.id });

  const columns: TableColumn<OrgMember>[] = [
    {
      key: "member",
      header: "Member",
      cell: (member) => {
        const initials = `${member.firstName?.[0] ?? ""}${
          member.lastName?.[0] ?? ""
        }`;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-sm bg-outline-gray-700 flex rounded-full items-center justify-center">
              {initials || "?"}
            </div>
            <span className="whitespace-nowrap font-medium">
              {member.firstName} {member.lastName}
            </span>
          </div>
        );
      },
    },
    {
      key: "email",
      header: "Email",
      cell: (member) => (
        <span className="text-secondary whitespace-nowrap">{member.email}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (member) => (
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full border whitespace-nowrap",
            roleBadgeClasses[member.role],
          )}
        >
          {roleLabels[member.role] ?? member.role}
        </span>
      ),
    },
    {
      key: "joinedAt",
      header: "Date joined",
      align: "right",
      cell: (member) => (
        <span className="text-secondary whitespace-nowrap">
          {formatDate(new Date(member.joinedAt))}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full mt-10">
      <div className="flex items-center gap-2">
        <h2 className="text-secondary leading-[120%] tracking-[-4%]">
          Active Members
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-light-gray/10 text-secondary">
          {members?.length ?? 0}
        </span>
      </div>
      <div className="mt-4">
        {members === undefined ? (
          <TableSkeleton columns={columns} rows={3} />
        ) : (
          <Table<OrgMember>
            data={members ?? []}
            columns={columns}
            rowKey={(member) => member.value}
            emptyState={
              <p className="text-secondary text-sm py-6 text-center">
                No members yet.
              </p>
            }
          />
        )}
      </div>
    </div>
  );
}
