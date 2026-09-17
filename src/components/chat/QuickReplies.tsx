"use client";

import {
  Check,
  ClipboardList,
  Coins,
  CreditCard,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { CANCEL_ACTION, type OrchestratorState } from "@/types/api";
import { cn } from "@/lib/utils";

export interface QuickReply {
  label: string;
  message: string;
  icon?: LucideIcon;
  variant?: "default" | "subtle";
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
  consultar_limite: { label: "Ver meu limite", message: "quero ver meu limite", icon: CreditCard },
  solicitar_aumento: { label: "Aumentar limite", message: "quero aumentar meu limite", icon: TrendingUp },
  cotacao_cambio: { label: "Cotação de moedas", message: "cotação de moedas", icon: Coins },
  atualizar_perfil: { label: "Atualizar perfil", message: "quero atualizar meu perfil", icon: ClipboardList },
};

const CANCEL_REPLY: QuickReply = { label: "Cancelar", message: "cancelar", icon: X, variant: "subtle" };

const YES_NO: QuickReply[] = [
  { label: "Sim", message: "sim", icon: Check },
  { label: "Não", message: "não", icon: X },
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

function flowReplies(state: OrchestratorState): QuickReply[] {
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
    default:
      return [];
  }
}

export function getQuickReplies(
  state: OrchestratorState,
  isAuthenticated: boolean,
  availableActions: string[],
  hasPendingOffer: boolean,
  lastAssistantMessage: string | null
): QuickReply[] {
  if (state === "authenticated") {
    if (!isAuthenticated) return [];
    const menu = availableActions
      .map((action) => ACTION_REPLIES[action])
      .filter((reply): reply is QuickReply => Boolean(reply));
    const asksYesNo =
      hasPendingOffer ||
      (lastAssistantMessage ? YES_NO_QUESTION.test(lastAssistantMessage.trim()) : false);
    return asksYesNo ? [...YES_NO, ...menu] : menu;
  }

  const replies = flowReplies(state);
  // O back-end lista "cancelar" enquanto um fluxo de coleta esta aberto
  const canCancel = isAuthenticated && availableActions.includes(CANCEL_ACTION);
  return canCancel ? [...replies, CANCEL_REPLY] : replies;
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
      className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1 pt-3 md:flex-wrap md:overflow-visible"
      role="group"
      aria-label="Respostas rápidas"
    >
      {replies.map((reply) => {
        const Icon = reply.icon;
        return (
          <button
            key={reply.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(reply.message)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-50",
              reply.variant === "subtle"
                ? "border-line bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink"
                : "border-brand/30 bg-brand-soft/60 text-brand-ink hover:border-brand hover:bg-brand-soft"
            )}
          >
            {Icon && <Icon size={14} aria-hidden="true" />}
            {reply.label}
          </button>
        );
      })}
    </div>
  );
}
