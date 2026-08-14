import { Compass } from "lucide-react";
import Link from "next/link";

export default function WorkspaceNotFound() {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-outline-gray">
        <Compass className="size-6 text-white" />
      </div>
      <span className="text-2xl leading-[120%] tracking-[-4%]">
        Page not found
      </span>
      <p className="max-w-md leading-[120%] tracking-[-4%] text-secondary">
        We couldn&apos;t find the page you were looking for. It may have been
        moved, deleted, or never existed.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/70"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
