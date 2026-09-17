"use client";

import { RefreshCw } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { Button } from "@/components/ui/Button";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  isWakingUp: boolean;
  initFailed: boolean;
  onRetry: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({
  messages,
  isLoading,
  isWakingUp,
  initFailed,
  onRetry,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {isWakingUp && (
          <p className="text-center text-xs text-gray-500 px-6" role="status">
            O assistente está iniciando. Na primeira visita isso pode levar até 30 segundos.
          </p>
        )}

        {initFailed && !isLoading && (
          <div className="flex justify-center">
            <Button variant="secondary" size="sm" onClick={onRetry}>
              <RefreshCw size={14} />
              Tentar novamente
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
