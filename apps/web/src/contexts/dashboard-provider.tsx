"use client";
import { api } from "@repo/convex/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { UserType } from "@/types/user.type";
import { FunctionReturnType } from "convex/server";
import { createContext, useContext, ReactNode } from "react";
import { OrganizationType } from "@/types/organization.type";
import { DashboardSkeleton } from "@/components/layout/dashboard-skeleton";

type Role = NonNullable<
  FunctionReturnType<typeof api.org_functions.getOrganization>
>["role"];

type DashboardContextType = {
  user: UserType & { role: Role };
  org: OrganizationType;
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const orgId = params.id as string;

  const user = useQuery(api.auth.getCurrentUser);
  const org = useQuery(api.org_functions.getOrganization, { orgId });

  if (user === undefined || org === undefined) {
    return <DashboardSkeleton />;
  }

  if (user === null || org === null) {
    return (
      <div className="w-full h-dvh flex flex-col gap-2 items-center justify-center text-center">
        <span className="text-2xl leading-[120%] tracking-[-4%]">
          Workspace unavailable
        </span>
        <p className="leading-[120%] tracking-[-4%] text-secondary max-w-md">
          We couldn&apos;t load this workspace. It may not exist or you may not
          have access to it.
        </p>
      </div>
    );
  }

  return (
    <DashboardContext.Provider
      value={{
        user: { ...user, role: org.role },
        org: { id: org._id, name: org.name, description: org.description },
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
