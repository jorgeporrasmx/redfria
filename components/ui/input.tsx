"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-400",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "hover:border-gray-400",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300",
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
