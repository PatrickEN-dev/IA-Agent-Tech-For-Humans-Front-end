"use client";

import { cn } from "@/lib/utils";
import { Monogram } from "./Wordmark";

export interface AvatarProps {
  variant: "user" | "assistant";
  /** Inicial do cliente autenticado. */
  initial?: string | null;
  className?: string;
}

export function Avatar({ variant, initial, className }: AvatarProps) {
  if (variant === "assistant") {
    return <Monogram size={28} tone="dark" className={className} />;
  }

  return (
    <span
      className={cn(
        "inline-grid h-7 w-7 shrink-0 place-items-center rounded border border-line bg-surface-muted text-xs font-semibold text-ink-muted",
        className
      )}
      aria-hidden="true"
    >
      {initial ? initial.toUpperCase() : "V"}
    </span>
  );
}
