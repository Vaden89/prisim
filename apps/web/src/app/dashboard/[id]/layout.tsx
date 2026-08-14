"use client";
import { ReactNode } from "react";
import { Header } from "@/components/layout/dashboard/header";
import { Sidebar } from "@/components/layout/dashboard/sidebar";
import { DashboardProvider } from "@/contexts/dashboard-provider";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <div className="w-full h-dvh flex overflow-hidden">
        <Sidebar />
        <div className="bg-tertiary w-full h-full flex flex-col min-h-0">
          <Header />
          <div
            data-lenis-prevent
            className="flex-1 min-h-0 w-full overflow-y-auto px-4 pt-4 pb-8"
          >
            {children}
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
