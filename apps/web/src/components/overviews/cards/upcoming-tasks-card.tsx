"use client";
import { api } from "@repo/convex/api";
import { useQuery } from "convex/react";
import { type FunctionReturnType } from "convex/server";
import { useRouter } from "next/navigation";
import {
  Table,
  TableSkeleton,
  type TableColumn,
} from "@/components/common/table";
import { useDashboard } from "@/contexts/dashboard-provider";
import { priorities } from "@/data/priorities";
import { formatDate } from "@/utils/date";
import { capitalizeFirstLetter } from "@/utils/string";

type MyTask = FunctionReturnType<typeof api.task_functions.getMyTasks>[number];

const columns: TableColumn<MyTask>[] = [
  {
    key: "title",
    header: "Task",
    className: "max-w-[320px]",
    cell: (task) => (
      <span className="block truncate font-medium">{task.title}</span>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    cell: (task) => {
      const priority = priorities.find((p) => p.value === task.priority);
      if (!priority) return <span className="text-secondary">—</span>;
      return (
        <span
          className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{
            color: priority.color,
            backgroundColor: `${priority.color}1a`,
          }}
        >
          {priority.label}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    cell: (task) => {
      if (!task.status) return <span className="text-secondary">—</span>;
      return (
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: task.status.color }}
          />
          {capitalizeFirstLetter(task.status.name)}
        </span>
      );
    },
  },
  {
    key: "board",
    header: "Board",
    cell: (task) =>
      task.board ? (
        <span className="whitespace-nowrap">{task.board.name}</span>
      ) : (
        <span className="text-secondary">—</span>
      ),
  },
  {
    key: "createdAt",
    header: "Date created",
    cell: (task) => (
      <span className="text-secondary whitespace-nowrap">
        {formatDate(new Date(task._creationTime))}
      </span>
    ),
  },
];

export function UpcomingTasksCard() {
  const router = useRouter();
  const { org } = useDashboard();
  const tasks = useQuery(api.task_functions.getMyTasks);

  return (
    <div className="w-full lg:col-span-2 p-4 bg-outline-gray-800 border border-[#1F1F20] rounded-2xl mt-4 lg:mt-0">
      <span className="text-sm tracking-[-4%] leading-[120%] ">
        Highlighted Tasks
      </span>

      <div className="mt-4 overflow-x-auto">
        {tasks === undefined ? (
          <TableSkeleton<MyTask> columns={columns} rows={5} />
        ) : (
          <Table<MyTask>
            data={tasks}
            columns={columns}
            rowKey={(task) => task._id}
            onRowClick={(task) =>
              router.push(`/dashboard/${org.id}/tasks/${task._id}`)
            }
            emptyState={
              <div className="py-10 text-center text-secondary text-sm">
                You have no tasks yet.
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
