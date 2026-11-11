import { Modal } from "@repo/ui";
import { CreateWorkspaceForm } from "../forms/create-workspace-form";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export function CreateWorkspaceModal() {
  const handleSuccess = (orgId: string) => {
    redirect(`/dashboard/${orgId}`);
  };

  return (
    <Modal
      title="Create your workspace"
      trigger={
        <div className="h-10 w-10 rounded-full bg-outline-gray-200 hover:bg-outline-gray-800 text-secondary flex items-center justify-center">
          <Plus size={20} />
        </div>
      }
    >
      <CreateWorkspaceForm onSuccess={handleSuccess} />
    </Modal>
  );
}
