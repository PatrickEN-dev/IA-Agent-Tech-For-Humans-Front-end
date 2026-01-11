"use client";

import { type HTMLAttributes, forwardRef } from "react";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  variant: "user" | "assistant";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const iconSizes = {
  sm: 14,
  md: 18,
  lg: 22,
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, variant, size = "md", ...props }, ref) => {
    const Icon = variant === "user" ? User : Bot;

    return (
      <div
        ref={ref}
        className={cn(
          "flex-shrink-0 rounded-full flex items-center justify-center",
          variant === "user" ? "bg-blue-600" : "bg-gray-600",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <Icon size={iconSizes[size]} className="text-white" />
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
