"use client";

import { cn } from "./cn";
import { Button as BaseButton } from "@base-ui/react/button";

import type { ComponentProps } from "react";

type ButtonProps = Omit<ComponentProps<typeof BaseButton>, "className"> & {
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  loading?: boolean;
};

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-white hover:bg-primary/70",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  destructive: "bg-destructive text-white hover:bg-destructive/70",
  ghost: "text-zinc-900 hover:bg-zinc-100",
};

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z"
      />
    </svg>
  );
}

export function Button({
  className,
  variant = "primary",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyling =
    "relative inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

  const styling = cn(baseStyling, variantStyles[variant], className);

  return (
    <BaseButton
      className={styling}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
      <span className={cn("inline-flex items-center", loading && "invisible")}>
        {children}
      </span>
    </BaseButton>
  );
}
