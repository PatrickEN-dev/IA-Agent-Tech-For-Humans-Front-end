"use client";

import { Avatar } from "@/components/ui/Avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-2.5 animate-message-in" role="status" aria-label="Assistente digitando">
      <div className="w-8 shrink-0 pt-0.5">
        <Avatar variant="assistant" />
      </div>
      <div className="flex h-10 items-center gap-1 rounded-2xl rounded-tl-md bg-surface-2 px-4 shadow-bubble">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-ink-muted/70 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
