"use client";

import { cn } from "@/lib/utils";
import { tripStatusMeta } from "@/lib/constants";

// Static class map so Tailwind can see every color combination at build time.
const COLOR_CLASSES: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-blue-100 text-blue-800",
  indigo: "bg-indigo-100 text-indigo-800",
  amber: "bg-amber-100 text-amber-800",
  green: "bg-green-100 text-green-800",
  teal: "bg-teal-100 text-teal-800",
  slate: "bg-slate-200 text-slate-700",
  red: "bg-red-100 text-red-800",
};

const DOT_CLASSES: Record<string, string> = {
  gray: "bg-gray-400",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  amber: "bg-amber-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
  slate: "bg-slate-500",
  red: "bg-red-500",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const meta = tripStatusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        COLOR_CLASSES[meta.color],
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", DOT_CLASSES[meta.color])} />
      {meta.label}
    </span>
  );
}
