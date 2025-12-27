"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-100 text-gray-800": variant === "default",
          "bg-green-100 text-green-800": variant === "success",
          "bg-yellow-100 text-yellow-800": variant === "warning",
          "bg-red-100 text-red-800": variant === "danger",
          "border border-gray-300 text-gray-700": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

// Specialized availability badge
export function AvailabilityBadge({
  status,
  className,
}: {
  status: "GREEN" | "YELLOW" | "RED";
  className?: string;
}) {
  const config = {
    GREEN: { label: "Disponible", variant: "success" as const },
    YELLOW: { label: "Por estar disponible", variant: "warning" as const },
    RED: { label: "No disponible", variant: "danger" as const },
  };

  const { label, variant } = config[status];

  return (
    <Badge variant={variant} className={cn("gap-1", className)}>
      <span
        className={cn("h-2 w-2 rounded-full", {
          "bg-green-500": status === "GREEN",
          "bg-yellow-500": status === "YELLOW",
          "bg-red-500": status === "RED",
        })}
      />
      {label}
    </Badge>
  );
}
