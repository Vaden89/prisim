import { useDashboard } from "@/contexts/dashboard-provider";
import { getConvexErrorMessage } from "@/lib/convex-error";
import { api } from "@repo/convex/api";
import { Button, FormField, FormTextArea } from "@repo/ui";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export function OrganizationDetailsCard() {
  const { org, user } = useDashboard();
  const [values, setValues] = useState({
    name: org.name,
    description: org.description,
  });
  const [loading, setLoading] = useState(false);
  const updateOrg = useMutation(api.org_functions.updateOrganization);
  const hasChanges =
    values.name !== org.name || values.description !== org.description;

  async function handleSubmit() {
    try {
      setLoading(true);
      await updateOrg({
        name: values.name,
        description: values.description,
        orgId: org.id,
      });
    } catch (error) {
      toast.error(getConvexErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-4 bg-outline-gray-800 border border-[#1F1F20] rounded-2xl flex flex-col justify-between mt-5">
      <div className="w-full flex items-center justify-between">
        <span className="text-secondary leading-[120%] tracking-[-4%]">
          Organiztion Details
        </span>
        <span className="border border-outline-gray px-2 py-1 text-sm rounded-full text-light-gray">
          {user.role}
        </span>
      </div>
      <form className="flex flex-col gap-4 mt-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            value={values.name}
            label="Organization Name"
            readOnly
            onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
          />
          <FormField
            placeholder=""
            value={"prism.app/dev/" + values.name}
            label="Workspace URL"
            name="url"
            readOnly
          />
        </div>
        <FormTextArea
          readOnly
          label="Description"
          value={values.description}
          placeholder="A description of your organization"
          onChange={(e) =>
            setValues((p) => ({ ...p, description: e.target.value }))
          }
        />

        {hasChanges && (
          <div className="flex justify-end">
            <Button loading={loading} variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
