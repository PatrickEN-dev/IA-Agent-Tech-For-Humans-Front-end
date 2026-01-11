"use client";

import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

function formatContent(content: string): React.ReactNode {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={i} className="font-semibold">
          {line.slice(2, -2)}
        </p>
      );
    }

    const boldMatch = line.match(/- \*\*(.+?)\*\*(.+)/);
    if (boldMatch) {
      return (
        <p key={i}>
          - <strong>{boldMatch[1]}</strong>
          {boldMatch[2]}
        </p>
      );
    }

    return <p key={i}>{line || "\u00A0"}</p>;
  });
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar variant={isUser ? "user" : "assistant"} />
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white border border-gray-200 rounded-bl-md shadow-sm"
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {formatContent(message.content)}
        </div>
        <div className={cn("text-xs mt-2", isUser ? "text-blue-200" : "text-gray-400")}>
          {message.timestamp.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
