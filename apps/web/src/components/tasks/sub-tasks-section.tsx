"use client";

import LoadingState from "@/components/tasks/sub-task-loading";
import { api } from "@repo/convex/api";
import { type FunctionReturnType } from "convex/server";
import { useQuery } from "convex/react";
import { CheckCircle2, Circle, ListChecks } from "lucide-react";
import { TaskType } from "@/types/tasks.types";

type SubTask = FunctionReturnType<
  typeof api.sub_task_functions.getSubTasks
>[number];

export function SubTasksSection({ task }: { task: TaskType }) {
  const subTasks = useQuery(api.sub_task_functions.getSubTasks, {
    taskId: task._id,
  });

  const isReasoning = task.isReasoning ?? false;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary">Sub-tasks</span>
        {!isReasoning && subTasks && subTasks.length > 0 && (
          <span className="text-xs text-secondary tabular-nums">
            {subTasks.filter((s) => s.isCompleted).length}/{subTasks.length}{" "}
            done
          </span>
        )}
      </div>

      <div className="rounded-xl border border-outline-gray/50 overflow-hidden">
        {isReasoning ? (
          <ReasoningState />
        ) : subTasks === undefined ? (
          <SubTaskSkeleton />
        ) : subTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <SubTaskList subTasks={subTasks} />
        )}
      </div>
    </div>
  );
}

function ReasoningState() {
  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="flex flex-col items-center gap-3">
        <LoadingState label="Analyzing task" variant="Dots" />
        <p className="text-xs text-secondary text-center leading-relaxed">
          Breaking this task down into actionable sub-tasks&hellip;
        </p>
      </div>
    </div>
  );
}

function SubTaskSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-outline-gray/30">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="size-4 rounded-full bg-outline-gray/40 animate-pulse" />
          <div
            className="h-3.5 rounded bg-outline-gray/40 animate-pulse"
            style={{ width: `${50 + i * 15}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 gap-2">
      <ListChecks size={20} className="text-secondary" />
      <span className="text-sm text-secondary">No sub-tasks yet</span>
    </div>
  );
}

function SubTaskList({ subTasks }: { subTasks: SubTask[] }) {
  return (
    <ul className="flex flex-col divide-y divide-outline-gray/30">
      {subTasks.map((subTask) => (
        <li key={subTask._id} className="flex items-start gap-3 px-4 py-3">
          {subTask.isCompleted ? (
            <CheckCircle2
              size={16}
              className="text-green-500 mt-0.5 shrink-0"
            />
          ) : (
            <Circle size={16} className="text-secondary mt-0.5 shrink-0" />
          )}
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className={`leading-snug ${subTask.isCompleted ? "line-through text-secondary" : ""}`}
            >
              {subTask.title}
            </span>
            {subTask.description && (
              <span className="text-sm text-secondary leading-relaxed">
                {subTask.description}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
