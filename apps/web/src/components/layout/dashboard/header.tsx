"use client";
import { AddTaskModal } from "@/components/tasks/modals/add-task";
import { ProfileCard } from "@/components/users/profile-card";
import { useDashboard } from "@/contexts/dashboard-provider";
import { api } from "@repo/convex/api";
import { cn } from "@repo/ui";
import { useQuery } from "convex/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { Fragment } from "react";

export function Header() {
  const { user, org } = useDashboard();
  const orgId = org.id;
  const segments = useSelectedLayoutSegments();

  const section = segments[0] ?? null;
  const boardId = section === "boards" ? (segments[1] ?? null) : null;
  const taskId = section === "tasks" ? (segments[1] ?? null) : null;

  const board = useQuery(
    api.board_functions.getBoardWithTasks,
    boardId ? { boardId } : "skip",
  );
  const task = useQuery(
    api.task_functions.getTask,
    taskId ? { taskId } : "skip",
  );

  const crumbs: Crumb[] = [{ label: org.name, href: `/dashboard/${orgId}` }];

  if (section === null) {
    crumbs.push({ label: "Overview" });
  } else if (section === "settings") {
    crumbs.push({ label: "Settings" });
  } else if (section === "boards") {
    crumbs.push({ label: "Boards", href: `/dashboard/${orgId}/boards` });
    if (boardId) {
      crumbs.push({
        label: board === undefined ? null : (board?.name ?? "Board"),
      });
    }
  } else if (section === "tasks") {
    crumbs.push({ label: "Boards", href: `/dashboard/${orgId}/boards` });
    crumbs.push({
      label: task === undefined ? null : (task?.board.name ?? "Board"),
      href: task?.board
        ? `/dashboard/${orgId}/boards/${task.board._id}`
        : undefined,
    });
    crumbs.push({ label: taskId ? `#${taskId.slice(-6)}` : null });
  }

  return (
    <header className="w-full h-16 flex justify-between items-center gap-4 p-2 border-b-[0.7px] border-outline-gray/50">
      <nav className="flex items-center gap-1.5 text-sm text-secondary min-w-0">
        {crumbs.map((crumb, idx) => (
          <Fragment key={idx}>
            {idx > 0 && (
              <ChevronRight size={14} className="text-secondary/40 shrink-0" />
            )}
            <CrumbItem crumb={crumb} isLast={idx === crumbs.length - 1} />
          </Fragment>
        ))}
      </nav>
      <div className="flex gap-4">
        <ProfileCard user={user} />
        <div className="w-px h-10 bg-outline-gray" />
        <AddTaskModal />
      </div>
    </header>
  );
}

type Crumb = {
  label: string | null;
  href?: string;
};

function CrumbItem({ crumb, isLast }: { crumb: Crumb; isLast: boolean }) {
  if (crumb.label === null) {
    return (
      <span className="inline-block h-4 w-20 rounded bg-outline-gray-200 animate-pulse" />
    );
  }

  if (crumb.href && !isLast) {
    return (
      <Link
        href={crumb.href}
        className="truncate hover:text-foreground transition-colors"
      >
        {crumb.label}
      </Link>
    );
  }

  return (
    <span className={cn("truncate", isLast && "text-foreground")}>
      {crumb.label}
    </span>
  );
}
