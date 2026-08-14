import { api } from "@repo/convex/api";
import { Id } from "@repo/convex/dataModel";
import { FunctionReturnType } from "convex/server";

export type OrganizationType = {
  id: Id<"organizations">;
  name: string;
  description?: string;
};

export type OrgMember = NonNullable<
  FunctionReturnType<typeof api.org_functions.getOrgMembers>
>[number];
