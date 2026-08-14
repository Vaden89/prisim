import { SettingsItem } from "@/types/settings.type";
import { CircleGauge, LucideIcon } from "lucide-react";

export const menu = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For Engineering", href: "#" },
  { label: "Pricing", href: "#" },
];

export type DashboardMenuItem = {
  label: string;
  icon: LucideIcon;
  segment: string | null;
  href: (id: string) => string;
};

export const dashboardMenu: DashboardMenuItem[] = [
  {
    segment: null,
    label: "Overview",
    icon: CircleGauge,
    href: (id) => `/dashboard/${id}`,
  },
];

export const workspaceSettings: SettingsItem[] = [
  { label: "General", section: "workspace" },
  { label: "Team Members", section: "team-members" },
  { label: "Integrations", section: "integrations" },
];
