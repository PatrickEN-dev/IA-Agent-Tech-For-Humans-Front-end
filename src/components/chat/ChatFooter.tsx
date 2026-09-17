"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatInput } from "./ChatInput";
import { QuickReplies } from "./QuickReplies";
import type { OrchestratorState } from "@/types/api";

interface ChatFooterProps {
  currentState: OrchestratorState;
  isAuthenticated: boolean;
  availableActions: string[];
  hasPendingOffer: boolean;
  lastAssistantMessage: string | null;
  isLoading: boolean;
  onSend: (message: string) => void;
  onRestart: () => void;
}

function getPlaceholder(state: OrchestratorState): string {
  switch (state) {
    case "welcome":
    case "collecting_cpf":
      return "Digite seu CPF (só números ou com pontos)...";
    case "collecting_birthdate":
      return "Sua data de nascimento (DD/MM/AAAA)...";
    case "credit_increase_flow":
      return "Qual limite você quer? Ex: 10 mil...";
    case "interview_income":
      return "Sua renda mensal. Ex: 5 mil, 5k, 5000...";
    case "interview_employment":
      return "Seu tipo de trabalho...";
    case "interview_expenses":
      return "Total das suas despesas mensais...";
    case "interview_dependents":
      return "Quantos dependentes você tem?...";
    case "interview_debts":
      return "Você tem dívidas em aberto? (sim/não)...";
    case "exchange_from":
      return "Qual moeda? Ex: dólar, euro, USD...";
    case "exchange_to":
      return "Converter para qual moeda? Ex: real, BRL...";
    default:
      return "Digite sua mensagem...";
  }
}

function getInputMode(state: OrchestratorState): "text" | "numeric" | "decimal" {
  switch (state) {
    case "collecting_cpf":
    case "interview_dependents":
      return "numeric";
    case "credit_increase_flow":
    case "interview_income":
    case "interview_expenses":
      return "decimal";
    default:
      return "text";
  }
}

export function ChatFooter({
  currentState,
  isAuthenticated,
  availableActions,
  hasPendingOffer,
  lastAssistantMessage,
  isLoading,
  onSend,
  onRestart,
}: ChatFooterProps) {
  if (currentState === "goodbye") {
    return (
      <div className="max-w-2xl mx-auto w-full p-4">
        <Button onClick={onRestart} size="lg" className="w-full">
          <RefreshCw size={18} />
          Iniciar novo atendimento
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {!isLoading && (
        <QuickReplies
          state={currentState}
          isAuthenticated={isAuthenticated}
          availableActions={availableActions}
          hasPendingOffer={hasPendingOffer}
          lastAssistantMessage={lastAssistantMessage}
          onSelect={onSend}
        />
      )}
      <ChatInput
        onSend={onSend}
        disabled={isLoading}
        placeholder={getPlaceholder(currentState)}
        inputMode={getInputMode(currentState)}
      />
    </div>
  );
}
