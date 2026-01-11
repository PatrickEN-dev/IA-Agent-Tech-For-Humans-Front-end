"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatInput } from "./ChatInput";
import type { ChatState } from "@/types/chat";

interface ChatFooterProps {
  currentState: ChatState;
  isLoading: boolean;
  onSend: (message: string) => void;
  onRestart: () => void;
}

function getPlaceholder(state: ChatState): string {
  switch (state) {
    case "collecting_cpf":
      return "Digite seu CPF (apenas números)...";
    case "collecting_birthdate":
      return "Digite sua data de nascimento (DD/MM/AAAA)...";
    case "chat":
      return "Digite sua mensagem...";
    default:
      return "Digite sua resposta...";
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
