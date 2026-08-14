"use client";
import { cn } from "@repo/ui";

export function WorkspaceActivityCard() {
  return (
    <div className="w-full p-4 bg-outline-gray-800 border border-[#1F1F20] rounded-2xl">
      <span className="text-secondary text-sm tracking-[-4%] leading-[120%]">
        Workspace Activity
      </span>

      <div className="flex flex-col gap-3 mt-4">
        <ActivityPill
          index={1}
          description="moved task #7684T from inprogress to completed"
          first_name="Isaac"
          last_name="Shosanya"
        />
        <ActivityPill
          index={2}
          description="created task #7684T"
          first_name="Vladmir"
          last_name="Tepes"
        />
        <ActivityPill
          index={3}
          description="assigned task #7684T to Isaac Shosanya"
          first_name="Isaac"
          last_name="Shosanya"
        />
      </div>
    </div>
  );
}

function ActivityPill({
  index,
  description,
  first_name,
  last_name,
}: {
  index: number;
  description: string;
  first_name: string;
  last_name: string;
}) {
  const variant: Record<number, string> = {
    1: "bg-success",
    2: "bg-[#DC3F18]",
    3: "bg-[#4C18DC]",
  };

  return (
    <div className="w-full flex gap-2">
      <div
        className={cn(
          variant[index],
          "text-white w-6 h-6 rounded-full text-[10px] font-semibold tracking-[-4%] items-center justify-center inline-flex shrink-0",
        )}
      >
        {first_name.charAt(0).toUpperCase()} {last_name.charAt(0).toUpperCase()}
      </div>
      <span>
        <span className="shrink-0">
          {first_name} {last_name}
        </span>
        <span className="wrap-break-words ml-2 text-secondary">
          {description}
        </span>
      </span>
    </div>
  );
}
