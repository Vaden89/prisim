"use client";
import Link from "next/link";
import { cn } from "@repo/ui";
import Image from "next/image";
import { Fragment } from "react";
import { dashboardMenu } from "@/data/menu";
import { LucideIcon, Minimize2 } from "lucide-react";
import { BoardsNav } from "@/components/boards/boards-nav";
import { useSelectedLayoutSegments } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-provider";
import { SwitchWorkspaceBtn } from "@/components/workspace/switch-workspace-btn";
import { SettingsNav } from "./settings-nav";

export function Sidebar() {
  const { org } = useDashboard();
  const id = org.id;

  const segments = useSelectedLayoutSegments();
  const activeSegment = segments[0] ?? null;

  return (
    <aside className="w-75 h-full flex flex-col justify-between">
      <div>
        <div className="w-full flex items-center justify-between h-16 border-b-[0.7px] border-outline-gray/50 p-2">
          <Image src="/images/logo.svg" alt="" width={100} height={100} />
          <button className="cursor-pointer">
            <Minimize2 size={24} className="text-secondary" />
          </button>
        </div>
        <div className="flex flex-col gap-1 mt-2.5 p-2 pb-10">
          {dashboardMenu.map((item, idx) => {
            const isActive = item.segment === activeSegment;
            return (
              <Fragment key={idx}>
                <NavLink
                  icon={item.icon}
                  label={item.label}
                  href={item.href(id)}
                  isActive={isActive}
                />
                {item.segment === null && <BoardsNav />}
              </Fragment>
            );
          })}
        </div>
        <div className="border-t-[0.7px] border-outline-gray/50 p-2">
          <span className="text-xs tracking-wide text-secondary px-2 py-2.5">
            Settings
          </span>
          <SettingsNav />
        </div>
      </div>
      <div className="flex px-2 my-4">
        <SwitchWorkspaceBtn />
      </div>
    </aside>
  );
}

function NavLink({
  label,
  icon,
  href,
  isActive,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}) {
  const Icon = icon;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 text-dark-gray-500 p-2 py-3 rounded-lg hover:bg-tertiary/50 ",
        isActive && "bg-tertiary text-white",
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}
