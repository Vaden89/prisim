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
import { OrgInvitation, OrgMember } from "@/types/organization.type";
import { roleBadgeClasses, roleLabels } from "@/utils/roles";
import { useDashboard } from "@/contexts/dashboard-provider";
import { InviteNewMembersCard } from "./cards/invite-new-memebers.card";
import { RevokeInvitationModal } from "./modals/revoke-invitation-modal";

export function TeamMemberSection() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pb-20">
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
      <PendingInvitations />
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

function PendingInvitations() {
  const { org } = useDashboard();
  const invites = useQuery(api.invitation_functions.getInvitations, {
    workspaceId: org.id,
  });

  const columns: TableColumn<OrgInvitation>[] = [
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
      key: "createdAt",
      header: "Date Invited",
      cell: (member) => (
        <span className="text-secondary whitespace-nowrap">
          {formatDate(new Date(member._creationTime))}
        </span>
      ),
    },
    {
      key: "action",
      header: "",
      align: "right",
      cell: (member) => <RevokeInvitationModal invitationId={member._id} />,
    },
  ];

  return (
    <div className="w-full mt-10">
      <div className="flex items-center gap-2">
        <h2 className="text-secondary leading-[120%] tracking-[-4%]">
          Pending Invitations
        </h2>
        {invites === undefined ? (
          <span className="h-5 w-8 rounded-full bg-outline-gray-200 animate-pulse" />
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-light-gray/10 text-secondary">
            {invites.length}
          </span>
        )}
      </div>
      <div className="mt-4">
        {invites === undefined ? (
          <TableSkeleton columns={columns} rows={3} />
        ) : (
          <Table<OrgInvitation>
            data={invites}
            columns={columns}
            rowKey={(invite) => invite._id}
            emptyState={
              <div className="w-full flex flex-col gap-2 items-center justify-center text-secondary text-sm py-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M198.24,62.63l15.68-17.25a8,8,0,0,0-11.84-10.76L186.4,51.86A95.95,95.95,0,0,0,57.76,193.37L42.08,210.62a8,8,0,1,0,11.84,10.76L69.6,204.14A95.95,95.95,0,0,0,198.24,62.63ZM48,128A80,80,0,0,1,175.6,63.75l-107,117.73A79.63,79.63,0,0,1,48,128Zm80,80a79.55,79.55,0,0,1-47.6-15.75l107-117.73A79.95,79.95,0,0,1,128,208Z"></path>
                </svg>
                <p>No pending invitations.</p>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
