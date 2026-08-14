"use client";
import { TaskView } from "@/components/tasks/task-view";
import { api } from "@repo/convex/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

export default function TaskPage() {
  const params = useParams();
  const taskId = params.taskId as string;

  const task = useQuery(api.task_functions.getTask, { taskId });

  if (task === undefined) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <span className="text-secondary">Loading...</span>
      </div>
    );
  }

  if (task === null) {
    return (
      <div className="flex-1 h-full flex flex-col gap-2 items-center justify-center text-center">
        <span className="text-2xl leading-[120%] tracking-[-4%]">
          Task not found
        </span>
        <p className="leading-[120%] tracking-[-4%] text-secondary max-w-xl">
          This task doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  return <TaskView task={task} />;
}
