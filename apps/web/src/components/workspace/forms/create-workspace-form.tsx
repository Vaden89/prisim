"use client";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@repo/convex/api";
import { useMutation } from "convex/react";
import { Button, FormField } from "@repo/ui";
import { getConvexErrorMessage } from "@/lib/convex-error";

interface CreateWorkspaceProps {
  onSuccess?: (orgId: string) => void;
}

export const CreateWorkspaceForm = ({ onSuccess }: CreateWorkspaceProps) => {
  const [loading, setLoading] = useState(false);
  const [workspace_name, setWorkspaceName] = useState("");
  const createOrganization = useMutation(api.org_functions.createOrganization);

  const slug = workspace_name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orgId = await createOrganization({ name: workspace_name, slug });
      toast.success("Workspace created successfully");
      onSuccess?.(orgId);
    } catch (err) {
      setLoading(false);
      toast.error(getConvexErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-6">
      <FormField
        placeholder="Your organization/workspace name"
        label="Workspace Name"
        name="name"
        onChange={handleInput}
      />
      <div>
        <FormField
          placeholder=""
          value={"prism.app/dev/" + slug}
          label="Workspace URL"
          name="url"
          readOnly
        />
      </div>
      <Button loading={loading} type="submit" className="rounded-full py-3">
        Create Workspace
      </Button>
    </form>
  );
};
