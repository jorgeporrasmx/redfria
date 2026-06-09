"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "whatsapp";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          {
            // Variants
            "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow":
              variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500":
              variant === "secondary",
            "border-2 border-gray-300 bg-transparent text-gray-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 focus:ring-primary-500":
              variant === "outline",
            "text-gray-700 hover:bg-gray-100 focus:ring-gray-500": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow":
              variant === "danger",
            "bg-[#25D366] text-white hover:bg-[#1DA851] focus:ring-[#25D366] shadow-sm hover:shadow":
              variant === "whatsapp",
            // Sizes
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
