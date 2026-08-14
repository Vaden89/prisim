"use client";
import { AddTaskModal } from "@/components/tasks/modals/add-task";

export function EmptyTaskState({ boardId }: { boardId: string }) {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-center">
      <span className="text-2xl leading-[120%] tracking-[-4%]">
        No tasks created yet
      </span>
      <p className="leading-[120%] tracking-[-4%] text-secondary max-w-xl">
        Get started by creating your first task or linking a repository to
        auto-detect dependencies and build your architecture graph.
      </p>
      <AddTaskModal boardId={boardId} />
    </div>
  );
}
