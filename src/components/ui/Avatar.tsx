"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";

export interface AvatarProps {
  variant: "user" | "assistant";
  /** Inicial do cliente autenticado; sem ela mostra o ícone genérico. */
  initial?: string | null;
  className?: string;
}

export function Avatar({ variant, initial, className }: AvatarProps) {
  if (variant === "assistant") {
    return <BrandMark size={32} className={className} />;
  }

  return (
    <div
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-surface-2 text-ink-muted",
        className
      )}
      aria-hidden="true"
    >
      {initial ? (
        <span className="text-sm font-semibold text-brand-ink">{initial.toUpperCase()}</span>
      ) : (
        <User size={16} />
      )}
    </div>
  );
}
