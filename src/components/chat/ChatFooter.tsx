"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatInput } from "./ChatInput";
import type { OrchestratorState } from "@/types/api";

interface ChatFooterProps {
  currentState: OrchestratorState;
  isLoading: boolean;
  onSend: (message: string) => void;
  onRestart: () => void;
}

function getPlaceholder(state: OrchestratorState): string {
  switch (state) {
    case "COLLECTING_CPF":
      return "Digite seu CPF...";
    case "COLLECTING_BIRTHDATE":
      return "Digite sua data de nascimento (DD/MM/AAAA)...";
    case "INTERVIEW_INCOME":
      return "Digite sua renda mensal...";
    case "INTERVIEW_EMPLOYMENT":
      return "Digite seu tipo de emprego...";
    case "INTERVIEW_EXPENSES":
      return "Digite suas despesas mensais...";
    case "INTERVIEW_DEPENDENTS":
      return "Digite o número de dependentes...";
    case "INTERVIEW_DEBTS":
      return "Você tem dívidas? (sim/não)...";
    case "EXCHANGE_FROM":
      return "Digite a moeda de origem (ex: USD, EUR)...";
    case "EXCHANGE_TO":
      return "Digite a moeda de destino (ex: BRL)...";
    default:
      return "Digite sua mensagem...";
  }
}

export function ChatFooter({ currentState, isLoading, onSend, onRestart }: ChatFooterProps) {
  if (currentState === "GOODBYE") {
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
