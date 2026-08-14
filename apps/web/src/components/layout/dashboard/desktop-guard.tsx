"use client";
import { MonitorSmartphone } from "lucide-react";
import { ReactNode } from "react";

export function DesktopGuard({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-tertiary px-6 text-center lg:hidden">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-outline-gray">
          <MonitorSmartphone className="size-6 text-white" />
        </div>
        <span className="text-2xl leading-[120%] tracking-[-4%]">
          Desktop only
        </span>
        <p className="max-w-sm leading-[120%] tracking-[-4%] text-secondary">
          Prism is currently only available on desktop devices. Please switch to
          a larger screen to continue.
        </p>
      </div>
      <div className="hidden lg:contents">{children}</div>
    </>
  );
}
