"use client";
import { CircleUserRound } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-provider";
import {
  StatCard,
  RepositoriesCard,
  WorkspaceActivityCard,
  UpcomingTasksCard,
} from "@/components/overviews/cards";

export default function WorkspacePage() {
  const { user } = useDashboard();
  return (
    <div className="w-full min-h-0 flex flex-col">
      <div className="flex flex-col pt-8 px-2 pb-4 gap-2">
        <span className="text-[32px] leading-[120%] tracking-[-4%] font-medium">
          Welcome Back, {user.firstName} {user.lastName}!
        </span>
        <p className="text-secondary tracking-[-4%] leading-[120%]">
          You have a few tasks across 3 boards today!
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 mb-4 gap-4">
        <StatCard
          header="Assigned to me"
          icon={CircleUserRound}
          value={5}
          name="tasks"
        />
        <StatCard
          header="Completed This Week"
          icon={CircleUserRound}
          value={9}
          name="tasks"
        />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="gap-4 grid lg:grid-cols-1 grid-cols-2 lg:order-2">
          <RepositoriesCard />
          <WorkspaceActivityCard />
        </div>
        <UpcomingTasksCard />
      </div>
    </div>
  );
}
