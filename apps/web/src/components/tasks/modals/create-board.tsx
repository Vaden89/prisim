"use client";
import { getConvexErrorMessage } from "@/lib/convex-error";
import { createBoardSchema } from "@/lib/validators/board";
import { api } from "@repo/convex/api";
import { Button, FormField, FormTextArea, Modal } from "@repo/ui";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/contexts/dashboard-provider";

export function CreateBoardModal({ trigger }: { trigger?: ReactNode }) {
  const { org } = useDashboard();
  const orgId = org.id;

  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [boardDescription, setBoardDescription] = useState("");
  const createBoard = useMutation(api.board_functions.createBoard);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setError("");
      setBoardDescription("");
    }
    setOpen(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const parsed = createBoardSchema.safeParse({
      name: formData.get("name") ?? "",
      description: boardDescription || undefined,
      orgId,
    });

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Please fix the form errors.",
      );
      return;
    }

    setLoading(true);

    try {
      await createBoard(parsed.data);
      handleOpenChange(false);
      toast.success("Board created successfully");
    } catch (err) {
      setError(getConvexErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Board"
      size="md"
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        trigger ?? (
          <span className="flex items-center rounded-none text-foreground bg-primary px-3 py-2">
            <Plus size={20} className="mr-2" />
            <span>Create Board</span>
          </span>
        )
      }
    >
      <div className="flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-3">
          <FormField
            type="text"
            name="name"
            placeholder="Board Name"
            label="Board name"
          />
          <FormTextArea
            name="description"
            value={boardDescription}
            onChange={(e) => setBoardDescription(e.target.value)}
            placeholder="Board Description"
            label="Board description"
          />

          {error && (
            <div className="w-full mt-4 p-2 bg-destructive/10 border-destructive border rounded-xl">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="w-full flex items-center justify-end mt-4">
            <Button
              loading={loading}
              type="submit"
              className="rounded-full px-6"
            >
              Create Board
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
