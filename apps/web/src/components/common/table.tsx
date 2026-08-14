"use client";

import { cn } from "@repo/ui";
import { type ReactNode } from "react";

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  cell: (row: T, index: number) => ReactNode;
};

export type TableProps<T> = {
  data: T[];
  className?: string;
  hideHeader?: boolean;
  emptyState?: ReactNode;
  columns: TableColumn<T>[];
  rowKey: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
};

function alignClass(align?: "left" | "center" | "right") {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export function Table<T>({
  columns,
  data,
  rowKey,
  className,
  onRowClick,
  emptyState,
  hideHeader = false,
}: TableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      {!hideHeader && (
        <thead>
          <tr className="border-b border-outline-gray/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-2.5 font-medium text-secondary",
                  alignClass(col.align),
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
      )}

      <tbody>
        {data.map((row, index) => (
          <tr
            key={rowKey(row, index)}
            onClick={onRowClick ? () => onRowClick(row, index) : undefined}
            className={cn(
              "border-b border-outline-gray/30 transition-colors hover:bg-light-gray/5",
              onRowClick && "cursor-pointer",
            )}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className={cn(
                  "px-4 py-3 align-middle",
                  alignClass(col.align),
                  col.className,
                )}
              >
                {col.cell(row, index)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export type TableSkeletonProps<T> = {
  columns: TableColumn<T>[];
  rows?: number;
  className?: string;
  hideHeader?: boolean;
};

export function TableSkeleton<T>({
  columns,
  rows = 5,
  className,
  hideHeader = false,
}: TableSkeletonProps<T>) {
  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      {!hideHeader && (
        <thead>
          <tr className="border-b border-outline-gray/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-2.5 font-medium text-secondary",
                  alignClass(col.align),
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
      )}

      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="border-b border-outline-gray/30">
            {columns.map((col) => (
              <td
                key={col.key}
                className={cn("px-4 py-3 align-middle", col.className)}
              >
                <div className="h-4 w-full max-w-32 rounded-md bg-outline-gray-200 animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
