"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatInput } from "./ChatInput";
import type { ChatState } from "@/types/chat";
import { PLACEHOLDERS } from "@/constants/messages";

interface ChatFooterProps {
  currentState: ChatState;
  isLoading: boolean;
  onSend: (message: string) => void;
  onRestart: () => void;
}

function getPlaceholder(state: ChatState): string {
  switch (state) {
    case "collecting_cpf":
      return PLACEHOLDERS.CPF;
    case "collecting_birthdate":
      return PLACEHOLDERS.BIRTHDATE;
    case "collecting_limit":
      return PLACEHOLDERS.LIMIT;
    case "collecting_interview":
      return PLACEHOLDERS.INTERVIEW;
    default:
      return PLACEHOLDERS.DEFAULT;
  }
}

export function ChatFooter({ currentState, isLoading, onSend, onRestart }: ChatFooterProps) {
  if (currentState === "goodbye") {
    return (
      <div className="max-w-2xl mx-auto w-full p-4">
        <Button onClick={onRestart} size="lg" className="w-full">
          <RefreshCw size={18} />
          Iniciar Novo Atendimento
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <ChatInput onSend={onSend} disabled={isLoading} placeholder={getPlaceholder(currentState)} />
    </div>
  );
}
