"use client";

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
      return "Informe seu CPF (somente números ou com pontos)";
    case "collecting_birthdate":
      return "Data de nascimento (DD/MM/AAAA)";
    case "credit_increase_flow":
      return "Valor do novo limite, ex.: 10 mil";
    case "interview_income":
      return "Renda mensal, ex.: 5 mil";
    case "interview_employment":
      return "Tipo de trabalho";
    case "interview_expenses":
      return "Total das despesas mensais";
    case "interview_dependents":
      return "Número de dependentes";
    case "interview_debts":
      return "Possui dívidas em aberto? (sim ou não)";
    case "exchange_from":
      return "Moeda, ex.: dólar, euro, USD";
    case "exchange_to":
      return "Converter para qual moeda? ex.: real, BRL";
    default:
      return "Escreva sua mensagem";
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

function EndOfService({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="px-4 py-4 md:px-6">
      <div className="flex flex-col gap-3 rounded border border-line bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Atendimento encerrado</p>
          <p className="mt-0.5 text-sm text-ink-muted">Obrigado por falar com o Banco Ágil.</p>
        </div>
        <Button onClick={onRestart}>Iniciar novo atendimento</Button>
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
        <EndOfService onRestart={onRestart} />
      </div>
    );
  }

  return (
    <div className="border-t border-line bg-surface">
      <FlowProgress state={currentState} className="px-4 pt-3 md:px-6" />
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
