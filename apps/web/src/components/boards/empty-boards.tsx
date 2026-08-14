"use client";
import { CreateBoardModal } from "@/components/tasks/modals/create-board";

export function EmptyBoards() {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-center">
      <span className="text-2xl leading-[120%] tracking-[-4%]">
        No task boards yet
      </span>
      <p className="leading-[120%] tracking-[-4%] text-secondary max-w-xl">
        This workspace doesn&apos;t have any task boards. Create a board to start
        organizing and tracking your tasks.
      </p>
      <CreateBoardModal />
    </div>
  );
}
