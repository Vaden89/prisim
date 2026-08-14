"use client";
import { priorities } from "@/data/priorities";
import { getConvexErrorMessage } from "@/lib/convex-error";
import { updateTaskSchema } from "@/lib/validators/task";
import { formatDate } from "@/utils/date";
import { capitalizeFirstLetter } from "@/utils/string";
import { api } from "@repo/convex/api";
import { Button, Select, SelectItem } from "@repo/ui";
import { TaskType } from "@/types/tasks.types";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Pencil } from "lucide-react";
import { SubTasksSection } from "@/components/tasks/sub-tasks-section";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { commands } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const Markdown = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false },
);

type Draft = {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
};

export function TaskView({ task }: { task: TaskType }) {
  const orgId = task.board.orgId;
  const updateTask = useMutation(api.task_functions.updateTask);

  const serverValues: Draft = useMemo(
    () => ({
      title: task.title,
      description: task.description,
      status: task.status?._id ?? "",
      priority: task.priority,
      assignee: task.assignee?._id ?? "",
    }),
    [task],
  );

  const signature = JSON.stringify(serverValues);

  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Draft>(serverValues);
  const [editingDescription, setEditingDescription] = useState(false);

  useEffect(() => {
    setDraft(serverValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const isUnsaved = (Object.keys(serverValues) as (keyof Draft)[]).some(
    (key) => draft[key] !== serverValues[key],
  );

  const handleSave = async () => {
    const parsed = updateTaskSchema.safeParse(draft);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please fix the errors.");
      return;
    }

    setSaving(true);
    try {
      await updateTask({ taskId: task._id, ...parsed.data });
      toast.success("Changes saved");
    } catch (err) {
      toast.error(getConvexErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => setDraft(serverValues);

  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <Link
              href={`/dashboard/${orgId}/boards/${task.board._id}`}
              className="text-sm text-secondary hover:text-foreground w-fit flex items-center gap-1"
            >
              <ArrowLeft size={14} /> {task.board.name}
            </Link>

            <input
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Task title"
              className="text-2xl font-medium bg-transparent outline-0 w-full"
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">Description</span>
                <button
                  type="button"
                  onClick={() => setEditingDescription((prev) => !prev)}
                  className="flex items-center gap-1 text-xs text-secondary hover:text-foreground"
                >
                  <Pencil size={14} />
                  {editingDescription ? "Done" : "Edit"}
                </button>
              </div>

              {editingDescription ? (
                <MDEditor
                  preview="edit"
                  value={draft.description}
                  style={{ background: "none", boxShadow: "none" }}
                  onChange={(value) => update("description", value ?? "")}
                  extraCommands={[]}
                  commands={[
                    commands.bold,
                    commands.italic,
                    commands.checkedListCommand,
                    commands.orderedListCommand,
                  ]}
                  textareaProps={{ placeholder: "Add a task description" }}
                />
              ) : (
                <div className="rounded-xl border border-outline-gray/50 p-4">
                  {draft.description.trim() ? (
                    <Markdown
                      source={draft.description}
                      style={{ background: "none", color: "inherit" }}
                    />
                  ) : (
                    <span className="text-secondary text-sm">
                      No description yet.
                    </span>
                  )}
                </div>
              )}
            </div>

            <SubTasksSection task={task} />
          </div>
          <aside className="flex flex-col gap-5">
            <MetaRow label="Status">
              <StatusSelect
                orgId={orgId}
                value={draft.status}
                onChange={(value) => update("status", value)}
              />
            </MetaRow>

            <MetaRow label="Assignee">
              <AssigneeSelect
                orgId={orgId}
                value={draft.assignee}
                onChange={(value) => update("assignee", value)}
              />
            </MetaRow>

            <MetaRow label="Priority">
              <PrioritySelect
                value={draft.priority}
                onChange={(value) => update("priority", value)}
              />
            </MetaRow>

            <MetaRow label="Board">
              <Link
                href={`/dashboard/${orgId}/boards/${task.board._id}`}
                className="text-sm hover:text-foreground"
              >
                {task.board.name}
              </Link>
            </MetaRow>

            <MetaRow label="Created by">
              <span className="text-sm">
                {task.creator
                  ? `${task.creator.firstName} ${task.creator.lastName}`
                  : "—"}
              </span>
            </MetaRow>

            <MetaRow label="Created">
              <span className="text-sm text-secondary">
                {formatDate(new Date(task._creationTime))}
              </span>
            </MetaRow>
          </aside>
        </div>
      </div>

      {isUnsaved && (
        <div className="border-t border-outline-gray/50 bg-tertiary p-3 flex items-center justify-end gap-3">
          <span className="text-sm text-secondary mr-auto">
            You have unsaved changes
          </span>
          <button
            type="button"
            onClick={handleDiscard}
            disabled={saving}
            className="text-sm text-secondary hover:text-foreground px-4 py-2"
          >
            Discard
          </button>
          <Button
            loading={saving}
            onClick={handleSave}
            className="rounded-full px-6"
          >
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wide text-secondary">
        {label}
      </span>
      {children}
    </div>
  );
}

function StatusSelect({
  orgId,
  value,
  onChange,
}: {
  orgId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const statuses = useQuery(api.status_functions.getStatuses, { orgId });
  const options = statuses ?? [];

  const currentColor =
    options.find((s) => s._id === value)?.color ?? "transparent";

  return (
    <Select
      name="status"
      value={value}
      disabled={!statuses}
      onValueChange={onChange}
      className="rounded-full"
      placeholder={statuses ? "Select status" : "Loading..."}
      items={options.map((s) => ({ value: s._id, label: s.name }))}
      prefix={
        <div
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: currentColor }}
        />
      }
    >
      {options.map((s) => (
        <SelectItem key={s._id} value={s._id}>
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {capitalizeFirstLetter(s.name)}
          </div>
        </SelectItem>
      ))}
    </Select>
  );
}

function AssigneeSelect({
  orgId,
  value,
  onChange,
}: {
  orgId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const members = useQuery(api.org_functions.getOrgMembers, { orgId });
  const options = members ?? [];

  const current = options.find((m) => m.value === value);
  const initials = current
    ? `${current.firstName?.[0] ?? ""}${current.lastName?.[0] ?? ""}`
    : "";

  return (
    <Select
      name="assignee"
      value={value}
      disabled={!members}
      onValueChange={onChange}
      className="rounded-full"
      placeholder={members ? "Select assignee" : "Loading..."}
      items={options.map((m) => ({
        value: m.value,
        label: `${m.firstName} ${m.lastName}`,
      }))}
      prefix={
        <div className="w-6 h-6 text-sm bg-outline-gray-700 flex rounded-full items-center justify-center">
          {initials || "?"}
        </div>
      }
    >
      {options.map((m) => (
        <SelectItem key={m.value} value={m.value}>
          {m.firstName} {m.lastName}
        </SelectItem>
      ))}
    </Select>
  );
}

function PrioritySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const currentColor =
    priorities.find((p) => p.value === value)?.color ?? "transparent";

  return (
    <Select
      name="priority"
      value={value}
      onValueChange={onChange}
      className="rounded-full"
      placeholder="Select priority"
      items={priorities}
      prefix={
        <div
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: currentColor }}
        />
      }
    >
      {priorities.map((p) => (
        <SelectItem key={p.value} value={p.value}>
          {p.label}
        </SelectItem>
      ))}
    </Select>
  );
}
