"use client";

import { Button } from "@/components/ui/Button";
import { ChatInput } from "./ChatInput";
import { FlowProgress } from "./FlowProgress";
import { PersonaPicker } from "./PersonaPicker";
import { QuickReplies } from "./QuickReplies";
import type { DemoPersona, OrchestratorState } from "@/types/api";

interface ChatFooterProps {
  currentState: OrchestratorState;
  isAuthenticated: boolean;
  availableActions: string[];
  hasPendingOffer: boolean;
  lastAssistantMessage: string | null;
  isLoading: boolean;
  personas: DemoPersona[];
  signupEnabled: boolean;
  demoNotice: string | null;
  onSend: (message: string) => void;
  onRestart: () => void;
  onSelectPersona: (personaId: string) => void;
}

function getPlaceholder(state: OrchestratorState): string {
  switch (state) {
    case "welcome":
    case "collecting_cpf":
      return "Informe seu CPF (somente números ou com pontos)";
    case "collecting_birthdate":
      return "Data de nascimento (DD/MM/AAAA)";
    case "signup_name":
      return "Nome e sobrenome";
    case "signup_birthdate":
      return "Data de nascimento (DD/MM/AAAA)";
    case "signup_cpf":
      return 'CPF, ou escreva "gera um pra mim"';
    case "signup_cep":
      return 'CEP, ou escreva "pular"';
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
    case "interview_confirm":
      return "Confirma os dados? (sim ou não)";
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
    case "signup_cpf":
    case "signup_cep":
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

/**
 * Fim de atendimento.
 *
 * No modo de demonstracao o encerramento tambem lista as personas: quem foi bloqueado
 * por errar o CPF tres vezes precisa de uma saida visivel, nao de um beco.
 */
function EndOfService({
  personas,
  signupEnabled,
  isLoading,
  onRestart,
  onSelectPersona,
}: {
  personas: DemoPersona[];
  signupEnabled: boolean;
  isLoading: boolean;
  onRestart: () => void;
  onSelectPersona: (personaId: string) => void;
}) {
  return (
    <div className="space-y-3 px-4 py-4 md:px-6">
      <div className="flex flex-col gap-3 rounded border border-line bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Atendimento encerrado</p>
          <p className="mt-0.5 text-sm text-ink-muted">Obrigado por falar com o Banco Ágil.</p>
        </div>
        <Button onClick={onRestart}>Iniciar novo atendimento</Button>
      </div>

      {(personas.length > 0 || signupEnabled) && (
        <div className="rounded border border-line p-4">
          <PersonaPicker
            personas={personas}
            signupEnabled={signupEnabled}
            disabled={isLoading}
            onSelect={onSelectPersona}
            onCreateAccount={() => {
              onRestart();
            }}
          />
        </div>
      )}
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
  personas,
  signupEnabled,
  demoNotice,
  onSend,
  onRestart,
  onSelectPersona,
}: ChatFooterProps) {
  if (currentState === "goodbye") {
    return (
      <div className="border-t border-line bg-surface">
        <EndOfService
          personas={personas}
          signupEnabled={signupEnabled}
          isLoading={isLoading}
          onRestart={onRestart}
          onSelectPersona={onSelectPersona}
        />
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
          personas={personas}
          signupEnabled={signupEnabled}
          onSelect={onSend}
          onSelectPersona={onSelectPersona}
        />
      )}
      <ChatInput
        onSend={onSend}
        disabled={isLoading}
        placeholder={getPlaceholder(currentState)}
        inputMode={getInputMode(currentState)}
        currentState={currentState}
        notice={isAuthenticated ? null : demoNotice}
      />
    </div>
  );
}
