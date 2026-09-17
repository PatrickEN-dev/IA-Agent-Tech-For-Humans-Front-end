"use client";

import { Avatar } from "@/components/ui/Avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3" role="status" aria-label="Assistente digitando">
      <div className="shrink-0 pt-5">
        <Avatar variant="assistant" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-ink">Assistente Banco Ágil</span>
        <div className="inline-flex h-10 items-center rounded border border-line bg-surface px-4 text-sm text-ink-muted">
          Digitando
          <span className="animate-pulse" aria-hidden="true">
            …
          </span>
        </div>
      </div>
    </div>
  );
}
