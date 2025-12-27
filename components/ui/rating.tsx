"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function RatingDisplay({
  rating,
  count,
  size = "md",
  showCount = true,
  className,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star
        className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")}
      />
      <span className={cn("font-medium text-gray-900", textClasses[size])}>
        {rating.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className={cn("text-gray-500", textClasses[size])}>
          ({count})
        </span>
      )}
    </div>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function RatingInput({ value, onChange, className }: RatingInputProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            className={cn(
              "h-8 w-8 transition-colors",
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}
