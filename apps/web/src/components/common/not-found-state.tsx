"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@repo/ui";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type NotFoundStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function NotFoundState({
  title = "Invitation not found",
  description = "This invitation may have expired, been revoked, or already been used. Please ask your workspace admin for a new invite.",
  action,
}: NotFoundStateProps) {
  return (
    <div className="w-full min-h-dvh h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg p-10 bg-tertiary rounded-2xl border-outline-gray/50 border flex flex-col items-center text-center">
        <div className="w-15 h-15 bg-outline-gray-800 flex items-center justify-center rounded-2xl border border-outline-gray/50">
          <Image
            width={28}
            height={28}
            loading="eager"
            alt="Prism Logo"
            src="/images/logo-2.svg"
          />
        </div>
        <h1 className="text-3xl font-semibold leading-[120%] tracking-[-4%] mt-4">
          {title}
        </h1>
        <p className="text-secondary text-sm mt-3 max-w-sm">{description}</p>

        {action ?? (
          <Link href="/" className="mt-8 w-full">
            <Button className="w-full py-3 rounded-xl">
              <ArrowLeft className="mr-2" size={20} />
              <span>Back to home</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
