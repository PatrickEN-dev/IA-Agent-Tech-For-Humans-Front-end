"use client";

import type { OrchestratorState } from "@/types/api";

export interface QuickReply {
  label: string;
  message: string;
}

interface QuickRepliesProps {
  state: OrchestratorState;
  isAuthenticated: boolean;
  availableActions: string[];
  hasPendingOffer: boolean;
  lastAssistantMessage: string | null;
  disabled?: boolean;
  onSelect: (message: string) => void;
}

const ACTION_REPLIES: Record<string, QuickReply> = {
  consultar_limite: { label: "Ver meu limite", message: "quero ver meu limite" },
  solicitar_aumento: { label: "Aumentar limite", message: "quero aumentar meu limite" },
  cotacao_cambio: { label: "Cotação de moedas", message: "cotação de moedas" },
  atualizar_perfil: { label: "Atualizar perfil", message: "quero atualizar meu perfil" },
};

const YES_NO: QuickReply[] = [
  { label: "Sim", message: "sim" },
  { label: "Não", message: "não" },
];

const EMPLOYMENT: QuickReply[] = [
  { label: "CLT", message: "CLT" },
  { label: "Autônomo", message: "autônomo" },
  { label: "MEI", message: "MEI" },
  { label: "Servidor público", message: "servidor público" },
  { label: "Desempregado", message: "desempregado" },
];

const DEPENDENTS: QuickReply[] = [
  { label: "Nenhum", message: "nenhum" },
  { label: "1", message: "1" },
  { label: "2", message: "2" },
  { label: "3", message: "3" },
];

const CURRENCIES: QuickReply[] = [
  { label: "Dólar (USD)", message: "USD" },
  { label: "Euro (EUR)", message: "EUR" },
  { label: "Libra (GBP)", message: "GBP" },
  { label: "Iene (JPY)", message: "JPY" },
  { label: "Peso argentino (ARS)", message: "ARS" },
];

const CURRENCIES_WITH_BRL: QuickReply[] = [{ label: "Real (BRL)", message: "BRL" }, ...CURRENCIES];

const LIMIT_AMOUNTS: QuickReply[] = [
  { label: "R$ 5 mil", message: "5 mil" },
  { label: "R$ 10 mil", message: "10 mil" },
  { label: "R$ 20 mil", message: "20 mil" },
];

// Ultima mensagem do assistente e uma pergunta de sim/nao ("Deseja solicitar aumento?")
const YES_NO_QUESTION = /(\b(deseja|gostaria)\b[^?]*\?\s*$)|(responda sim ou n[aã]o)/i;

export function getQuickReplies(
  state: OrchestratorState,
  isAuthenticated: boolean,
  availableActions: string[],
  hasPendingOffer: boolean,
  lastAssistantMessage: string | null
): QuickReply[] {
  switch (state) {
    case "interview_employment":
      return EMPLOYMENT;
    case "interview_dependents":
      return DEPENDENTS;
    case "interview_debts":
      return YES_NO;
    case "exchange_from":
      return CURRENCIES;
    case "exchange_to":
      return CURRENCIES_WITH_BRL;
    case "credit_increase_flow":
      return LIMIT_AMOUNTS;
    case "authenticated": {
      if (!isAuthenticated) return [];
      const menu = availableActions
        .map((action) => ACTION_REPLIES[action])
        .filter((reply): reply is QuickReply => Boolean(reply));
      const asksYesNo =
        hasPendingOffer || (lastAssistantMessage ? YES_NO_QUESTION.test(lastAssistantMessage.trim()) : false);
      return asksYesNo ? [...YES_NO, ...menu] : menu;
    }
    default:
      return [];
  }
}

export function QuickReplies({
  state,
  isAuthenticated,
  availableActions,
  hasPendingOffer,
  lastAssistantMessage,
  disabled,
  onSelect,
}: QuickRepliesProps) {
  const replies = getQuickReplies(
    state,
    isAuthenticated,
    availableActions,
    hasPendingOffer,
    lastAssistantMessage
  );

  if (replies.length === 0) return null;

  return (
    <div
      className="flex gap-2 overflow-x-auto px-4 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Respostas rápidas"
    >
      {replies.map((reply) => (
        <button
          key={reply.label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(reply.message)}
          className="whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
}
