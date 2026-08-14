"use client";

import { useDashboard } from "@/contexts/dashboard-provider";
import { workspaceSettings } from "@/data/menu";
import { SettingsItem } from "@/types/settings.type";
import { cn } from "@repo/ui";
import { Building2, ChevronDown, LucideIcon, ScanFace } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function SettingsNav() {
  const { org } = useDashboard();
  const activeSection = useSearchParams().get("active-section") ?? "account";

  return (
    <nav aria-label="Settings" className="mt-3 flex flex-col gap-2">
      <Link
        href={`/dashboard/${org.id}/settings?active-section=profile`}
        aria-current={activeSection === "profile" ? "page" : undefined}
        className={cn(
          "flex items-center gap-2 rounded-xl px-2 py-2.5 text-[15px] leading-5 text-dark-gray-500 transition-colors hover:bg-tertiary/50 hover:text-white",
          activeSection === "profile" && "bg-tertiary text-white",
        )}
      >
        <ScanFace size={20} />
        Profile
      </Link>
      <SettingsGroup
        icon={Building2}
        label="Workspace"
        defaultOpen
        items={workspaceSettings}
        activeSection={activeSection}
        workspaceId={org.id}
      />
    </nav>
  );
}

function SettingsGroup({
  icon,
  label,
  items,
  workspaceId,
  activeSection,
  defaultOpen = false,
}: {
  icon: LucideIcon;
  label: string;
  items: SettingsItem[];
  workspaceId: string;
  activeSection: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 text-left text-[15px]  text-dark-gray-500 transition-colors hover:bg-tertiary/40",
          items.some((item) => item.section === activeSection) && " text-white",
        )}
      >
        <Icon size={19} strokeWidth={1.8} />
        <span className="flex-1">{label}</span>
        <ChevronDown
          size={17}
          className={cn(
            "transition-transform duration-200",
            !isOpen && "-rotate-90",
          )}
        />
      </button>

      {isOpen && (
        <div className="ml-4 border-l border-outline-gray-700 pl-3">
          <div className="flex flex-col gap-1 py-1">
            {items.map((item) => (
              <SettingsLink
                key={item.section}
                item={item}
                workspaceId={workspaceId}
                isActive={activeSection === item.section}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsLink({
  item,
  workspaceId,
  isActive,
}: {
  item: SettingsItem;
  workspaceId: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={`/dashboard/${workspaceId}/settings?active-section=${item.section}`}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-xl px-3 py-2.5 text-[15px] leading-5 text-dark-gray-500 transition-colors hover:bg-tertiary/50 hover:text-white",
        isActive && "bg-tertiary text-white",
      )}
    >
      {item.label}
    </Link>
  );
}
