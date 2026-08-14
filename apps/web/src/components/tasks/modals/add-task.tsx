"use client";
import { useDashboard } from "@/contexts/dashboard-provider";
import { priorities } from "@/data/priorities";
import { getConvexErrorMessage } from "@/lib/convex-error";
import { createTaskSchema } from "@/lib/validators/task";
import { capitalizeFirstLetter } from "@/utils/string";
import { api } from "@repo/convex/api";
import { Button, Modal, Select, SelectItem } from "@repo/ui";
import { commands } from "@uiw/react-md-editor";
import { useAction, useQuery } from "convex/react";
import { Link2, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function AddTaskModal({ boardId }: { boardId?: string }) {
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const createTask = useAction(api.task_functions.createTaskWithAnalysis);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setError("");
      setTaskDescription("");
    }
    setOpen(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const parsed = createTaskSchema.safeParse({
      title: formData.get("title") ?? "",
      description: taskDescription,
      boardId: formData.get("board") ?? "",
      status: formData.get("status") ?? "",
      priority: formData.get("priority") ?? "",
      assignee: formData.get("assignee") ?? "",
    });

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Please fix the form errors.",
      );
      return;
    }

    setLoading(true);

    try {
      const tokenRes = await fetch("/api/auth/convex/token", {
        credentials: "include",
      });
      const { token } = (await tokenRes.json()) as { token?: string };

      if (!token) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

      await createTask({ ...parsed.data, token });
      handleOpenChange(false);
      toast.success("Task created", {
        description: `"${parsed.data.title}" was added successfully.`,
      });
    } catch (err) {
      setError(getConvexErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Task"
      size="lg"
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <span className="flex items-center rounded-none text-foreground bg-primary px-3 py-2">
          <Plus size={20} className="mr-2" />
          <span>New Task</span>
        </span>
      }
    >
      <div className="flex flex-col">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            className="w-full text-xl px-2 py-3 outline-0"
            autoComplete="false"
            autoCorrect="false"
          />
          <MDEditor
            preview="edit"
            extraCommands={[]}
            value={taskDescription}
            commands={[
              commands.bold,
              commands.italic,
              commands.checkedListCommand,
              commands.orderedListCommand,
            ]}
            textareaProps={{
              placeholder: "Add task description",
            }}
            style={{
              background: "none",
              boxShadow: "none",
            }}
            onChange={(value) => setTaskDescription(value ?? "")}
          />
          <div className="grid lg:grid-cols-3 gap-3 mt-4">
            <SelectBoardDropDown boardId={boardId} />
            <SelectStatusDropDown />
            <SelectPriorityDropDown />
            <SelectAssigneeDropDown />
          </div>
          {error && (
            <div className="w-full mt-4 p-2 bg-destructive/10 border-destructive border rounded-xl">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="w-full flex items-center justify-between mt-4">
            <button className="bg-outline-gray-200 p-2 rounded-full">
              <Link2 className="text-secondary" size={20} />
            </button>
            <Button
              loading={loading}
              type="submit"
              className="rounded-full px-6"
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function SelectBoardDropDown({ boardId }: { boardId?: string }) {
  const { org } = useDashboard();
  const orgId = org.id;

  const boards = useQuery(api.board_functions.getBoards, { orgId });
  const potentialBoards = boards ?? [];

  const selectItems = potentialBoards.map((b) => ({
    value: b._id,
    label: b.name,
  }));

  return (
    <Select
      name="board"
      disabled={!boards}
      defaultValue={boardId}
      className="rounded-full"
      items={!boards ? [] : selectItems}
      placeholder={boards ? "Select Board" : "Loading..."}
    >
      {potentialBoards.map((b) => (
        <SelectItem key={b._id} value={b._id}>
          {b.name}
        </SelectItem>
      ))}
    </Select>
  );
}

function SelectStatusDropDown() {
  const { org } = useDashboard();
  const orgId = org.id;

  const statuses = useQuery(api.status_functions.getStatuses, { orgId });
  const potentialStatuses = statuses ?? [];
  const [selectedStatus, setSelectedStatus] = useState("");

  const selectItems = potentialStatuses.map((s) => ({
    value: s._id,
    label: s.name,
  }));

  const currentColor =
    potentialStatuses.find((s) => s._id === selectedStatus)?.color ??
    "transparent";

  return (
    <Select
      name="status"
      className="rounded-full"
      placeholder="Select Status"
      items={selectItems}
      onValueChange={setSelectedStatus}
      prefix={
        <div
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: currentColor }}
        />
      }
    >
      {potentialStatuses.map((s) => (
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

function SelectPriorityDropDown() {
  const selectItems = priorities;
  const [selectedPriority, setSelectedPriority] = useState("low");

  const currentColor =
    selectItems.find((p) => p.value === selectedPriority)?.color ??
    "transparent";

  return (
    <Select
      name="priority"
      defaultValue="low"
      items={selectItems}
      className="rounded-full"
      placeholder="Select Priority"
      onValueChange={setSelectedPriority}
      prefix={
        <div
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: currentColor }}
        />
      }
    >
      {selectItems.map((p) => (
        <SelectItem key={p.value} value={p.value}>
          {p.label}
        </SelectItem>
      ))}
    </Select>
  );
}

function SelectAssigneeDropDown() {
  const { org } = useDashboard();
  const orgId = org.id;

  const members = useQuery(api.org_functions.getOrgMembers, { orgId });
  const potentialAssignees = members ?? [];
  const [selectedAssignee, setSelectedAssignee] = useState("");

  const selectItems = potentialAssignees.map((a) => ({
    value: a.value,
    label: `${a.firstName} ${a.lastName}`,
  }));

  const currentAssignee = potentialAssignees.find(
    (a) => a.value === selectedAssignee,
  );

  const initials = currentAssignee
    ? `${currentAssignee.firstName?.[0] ?? ""}${currentAssignee.lastName?.[0] ?? ""}`
    : "";

  return (
    <Select
      name="assignee"
      disabled={!members}
      className="rounded-full"
      items={!members ? [] : selectItems}
      onValueChange={setSelectedAssignee}
      placeholder={!members ? "Loading..." : "Assignee?"}
      prefix={
        <div className="w-6 h-6 text-sm bg-outline-gray-700 flex rounded-full items-center justify-center">
          {initials || "?"}
        </div>
      }
    >
      {potentialAssignees.map((a) => (
        <SelectItem key={a.value} value={a.value}>
          {a.firstName} {a.lastName}
        </SelectItem>
      ))}
    </Select>
  );
}
