"use client";

import { CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatInput } from "./ChatInput";
import { FlowProgress } from "./FlowProgress";
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

function GoodbyeCard({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="p-4 animate-fade-in">
      <div className="rounded-2xl border border-line bg-surface-2 p-5 text-center">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-accent/15 text-accent">
          <CheckCircle2 size={24} aria-hidden="true" />
        </div>
        <h2 className="mt-3 font-semibold text-ink">Atendimento encerrado</h2>
        <p className="mt-1 text-sm text-ink-muted">Obrigado por falar com o Banco Ágil.</p>
        <Button onClick={onRestart} size="lg" className="mt-4 w-full">
          <RefreshCw size={18} />
          Iniciar novo atendimento
        </Button>
      </div>
    </div>
  );
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
      <div className="border-t border-line bg-surface">
        <GoodbyeCard onRestart={onRestart} />
      </div>
    );
  }

  return (
    <div className="border-t border-line bg-surface">
      <FlowProgress state={currentState} />
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
