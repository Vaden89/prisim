"use client";
import { Button } from "@repo/ui";
import { EllipsisVertical, FolderClosed } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-provider";

export function RepositoriesCard() {
  return (
    <div className="w-full min-h-65 p-4 bg-outline-gray-800 border border-[#1F1F20] rounded-2xl flex flex-col justify-between">
      <div>
        <div className="w-full flex items-center justify-between text-secondary">
          <span className="text-sm tracking-[-4%] leading-[120%] ">
            Repositories
          </span>
          <EllipsisVertical size={24} />
        </div>

        <RepositoryPill name="backend" />
        <RepositoryPill name="frontend" />
      </div>

      <Button>Add new Repository</Button>
    </div>
  );
}

function RepositoryPill({ name }: { name: string }) {
  const { org } = useDashboard();
  return (
    <div className="w-full flex justify-between items-center mt-5">
      <div className="flex items-center text-sm gap-3">
        <FolderClosed size={20} color="#636169" />
        <span>
          {org.name}/{name}
        </span>
      </div>

      <div className="w-2 h-2 rounded-full bg-success mr-2" />
    </div>
  );
}
