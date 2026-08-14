"use client";
import { EmptyTaskState } from "@/components/boards/empty-task-state";
import { Table, type TableColumn } from "@/components/common/table";
import { priorities } from "@/data/priorities";
import { formatDate } from "@/utils/date";
import { capitalizeFirstLetter } from "@/utils/string";
import { useDashboard } from "@/contexts/dashboard-provider";
import { api } from "@repo/convex/api";
import { type FunctionReturnType } from "convex/server";
import { useRouter } from "next/navigation";

type BoardData = NonNullable<
  FunctionReturnType<typeof api.board_functions.getBoardWithTasks>
>;
type BoardTask = BoardData["tasks"][number];

export function BoardTable({
  boardId,
  tasks,
}: {
  boardId: string;
  tasks: BoardTask[];
}) {
  const router = useRouter();
  const { org } = useDashboard();
  const orgId = org.id;

  const columns: TableColumn<BoardTask>[] = [
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
      key: "assignee",
      header: "Assignee",
      cell: (task) => {
        if (!task.assignee) return <span className="text-secondary">—</span>;
        return (
          <span className="whitespace-nowrap">
            {task.assignee.firstName} {task.assignee.lastName}
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
      key: "createdAt",
      header: "Date created",
      cell: (task) => (
        <span className="text-secondary whitespace-nowrap">
          {formatDate(new Date(task._creationTime))}
        </span>
      ),
    },
  ];

  return (
    <Table<BoardTask>
      data={tasks}
      columns={columns}
      rowKey={(task) => task._id}
      onRowClick={(task) =>
        router.push(`/dashboard/${orgId}/tasks/${task._id}`)
      }
      emptyState={<EmptyTaskState boardId={boardId} />}
    />
  );
}
