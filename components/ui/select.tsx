"use client";

import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "hover:border-gray-400",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300",
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
