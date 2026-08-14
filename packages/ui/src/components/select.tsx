"use client";

import { cn } from "./cn";
import { ReactNode, ComponentProps } from "react";
import { Select as BaseSelect } from "@base-ui/react/select";

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
  name?: string;
  required?: boolean;
  prefix?: ReactNode;
  items?: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

export function Select({
  label,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  name,
  required,
  prefix,
  items,
  disabled,
}: SelectProps) {
  return (
    <BaseSelect.Root
      name={name}
      items={items}
      value={value}
      required={required}
      defaultValue={defaultValue}
      onValueChange={(newValue) => onValueChange?.(newValue ?? "")}
      disabled={disabled}
    >
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm text-light-gray">{label}</label>}
        <BaseSelect.Trigger
          className={cn(
            "w-full bg-outline-gray-200 rounded-xl flex items-center justify-between gap-2 px-3 py-2 outline outline-outline-gray-700 focus-within:outline-foreground text-secondary",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            {prefix}
            <BaseSelect.Value placeholder={placeholder} className="truncate" />
          </span>
          <BaseSelect.Icon>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
      </div>

      <BaseSelect.Portal>
        <BaseSelect.Positioner
          alignItemWithTrigger={false}
          className="outline-none z-50"
          sideOffset={4}
        >
          <BaseSelect.Popup className="bg-tertiary border border-border-gray rounded-xl shadow-lg p-1 min-w-(--anchor-width) outline-none text-foreground z-50">
            {children}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      className={cn(
        "flex cursor-pointer items-center justify-between px-3 py-2 outline-none rounded-lg select-none data-[highlighted]:bg-dark-gray-light/30",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}
