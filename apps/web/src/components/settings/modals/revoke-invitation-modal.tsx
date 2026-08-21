"use client";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@repo/convex/api";
import { Button, Modal } from "@repo/ui";
import { useMutation } from "convex/react";
import { getConvexErrorMessage } from "@/lib/convex-error";

export function RevokeInvitationModal({
  invitationId,
}: {
  invitationId: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const revokeMutation = useMutation(api.invitation_functions.deleteInvitation);

  async function handleRevoke() {
    setLoading(true);
    try {
      await revokeMutation({ invitationId });
      setOpen(false);
    } catch (error) {
      toast.error(getConvexErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      size="sm"
      open={open}
      onOpenChange={setOpen}
      title="Confirm Revoke"
      trigger={<span className="text-destructive">Revoke</span>}
      footer={
        <div className="w-full flex justify-end border-t-[0.7px] border-outline-gray/50 py-4 px-4">
          <Button
            loading={loading}
            disabled={loading}
            variant="destructive"
            onClick={handleRevoke}
          >
            Revoke
          </Button>
        </div>
      }
    >
      <p className="text-sm text-light-gray">
        Are you sure you want to revoke this invitation? This action cannot be
        undone and it&apos;d make the invitation link already sent unusable.
      </p>
    </Modal>
  );
}
