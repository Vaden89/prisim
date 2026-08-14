"use client";
import { api } from "@repo/convex/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { BoardTable } from "@/components/boards/board-table";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;

  const board = useQuery(api.board_functions.getBoardWithTasks, { boardId });

  if (board === undefined) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <span className="text-secondary">Loading...</span>
      </div>
    );
  }

  if (board === null) {
    return (
      <div className="flex-1 h-full flex flex-col gap-2 items-center justify-center text-center">
        <span className="text-2xl leading-[120%] tracking-[-4%]">
          Board not found
        </span>
        <p className="leading-[120%] tracking-[-4%] text-secondary max-w-xl">
          This board doesn&apos;t exist or has been removed. Pick another board
          from the sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <BoardTable boardId={boardId} tasks={board.tasks} />
      </div>
    </div>
  );
}
