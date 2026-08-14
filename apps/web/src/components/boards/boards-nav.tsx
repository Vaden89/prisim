"use client";
import { CreateBoardModal } from "@/components/tasks/modals/create-board";
import { useDashboard } from "@/contexts/dashboard-provider";
import { api } from "@repo/convex/api";
import { cn } from "@repo/ui";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function BoardsNav() {
  const params = useParams();
  const { org } = useDashboard();
  const orgId = org.id;
  const activeBoardId = (params.boardId as string) ?? null;

  const boards = useQuery(api.board_functions.getBoards, { orgId });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-sm uppercase tracking-wide text-secondary">
          Boards
        </span>
        <CreateBoardModal
          trigger={
            <span className="text-secondary hover:text-white cursor-pointer">
              <Plus size={18} />
            </span>
          }
        />
      </div>

      {boards === undefined ? (
        <BoardsSkeleton />
      ) : boards.length === 0 ? (
        <p className="px-2 py-1 text-sm text-secondary">No boards yet</p>
      ) : (
        <div className="flex flex-col gap-1 max-h-[40vh] overflow-y-auto">
          {boards.map((board) => (
            <BoardLink
              key={board._id}
              href={`/dashboard/${orgId}/boards/${board._id}`}
              name={board.name}
              taskCount={board.taskCount}
              isActive={board._id === activeBoardId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BoardLink({
  href,
  name,
  taskCount,
  isActive,
}: {
  href: string;
  name: string;
  taskCount: number;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between gap-2 text-dark-gray-500 px-2 py-2 rounded-lg hover:bg-tertiary/50",
        isActive && "bg-tertiary text-white",
      )}
    >
      <span className="truncate text-sm">{name}</span>
      <span
        className={cn(
          "shrink-0 min-w-6 text-center text-xs px-1.5 py-0.5 rounded-full bg-outline-gray-200 text-secondary",
          isActive && "text-white",
        )}
      >
        {taskCount}
      </span>
    </Link>
  );
}

function BoardsSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between gap-2 px-2 py-2"
        >
          <div className="h-4 w-32 rounded-md bg-outline-gray-200 animate-pulse" />
          <div className="h-4 w-6 rounded-full bg-outline-gray-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
