"use client";
import { type LucideIcon } from "lucide-react";
import { capitalizeFirstLetter } from "@/utils/string";

interface StatCardProps {
  header: string;
  icon?: LucideIcon;
  value: number;
  name: string;
}

export function StatCard({ header, icon, value, name }: StatCardProps) {
  const Icon = icon;
  return (
    <div className="w-full min-h-38 rounded-2xl py-4 px-4 bg-outline-gray-800 border border-[#1F1F20]">
      <div className="flex items-center justify-between gap-2 text-secondary">
        <span className="text-sm">{header}</span>
        {Icon && <Icon size={20} />}
      </div>
      <div className="flex items-baseline mt-10 gap-4">
        <span className="font-medium text-5xl tracking-[-22%] leading-[120%]">
          {value}
        </span>
        <span className="text-sm tracking-[-4%] leading-[120%]">
          {capitalizeFirstLetter(name)}
        </span>
      </div>
    </div>
  );
}
