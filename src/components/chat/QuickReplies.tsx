"use client";

import { CANCEL_ACTION, type DemoPersona, type OrchestratorState } from "@/types/api";
import { cn } from "@/lib/utils";

export interface QuickReply {
  label: string;
  message: string;
  variant?: "default" | "subtle";
  /** Quando presente, o chip faz login por persona em vez de enviar uma mensagem. */
  personaId?: string;
}

interface QuickRepliesProps {
  state: OrchestratorState;
  isAuthenticated: boolean;
  availableActions: string[];
  hasPendingOffer: boolean;
  lastAssistantMessage: string | null;
  personas?: DemoPersona[];
  signupEnabled?: boolean;
  disabled?: boolean;
  onSelect: (message: string) => void;
  onSelectPersona?: (personaId: string) => void;
}

const ACTION_REPLIES: Record<string, QuickReply> = {
  consultar_limite: { label: "Consultar limite", message: "quero ver meu limite" },
  solicitar_aumento: { label: "Solicitar aumento", message: "quero aumentar meu limite" },
  cotacao_cambio: { label: "Cotação de moedas", message: "cotação de moedas" },
  atualizar_perfil: { label: "Atualizar perfil", message: "quero atualizar meu perfil" },
};

const CANCEL_REPLY: QuickReply = { label: "Cancelar", message: "cancelar", variant: "subtle" };

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

const SIGNUP_REPLY: QuickReply = { label: "Criar conta de teste", message: "criar conta" };

// Atalhos dentro do cadastro: as duas unicas respostas que o visitante nao adivinha.
const SIGNUP_CPF_REPLIES: QuickReply[] = [
  { label: "Gera um CPF pra mim", message: "gera um pra mim" },
];
const SIGNUP_CEP_REPLIES: QuickReply[] = [
  { label: "Pular", message: "pular", variant: "subtle" },
];

const SIGNUP_CANCEL: QuickReply = { label: "Cancelar", message: "cancelar", variant: "subtle" };

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
    case "interview_confirm":
      // O resumo ja esta na tela; o cliente so precisa aceitar ou refazer.
      return [
        { label: "Sim, pode atualizar", message: "sim" },
        { label: "Não, quero refazer", message: "não", variant: "subtle" },
      ];
    case "exchange_from":
      return CURRENCIES;
    case "exchange_to":
      return CURRENCIES_WITH_BRL;
    case "credit_increase_flow":
      return LIMIT_AMOUNTS;
    case "signup_cpf":
      return [...SIGNUP_CPF_REPLIES, SIGNUP_CANCEL];
    case "signup_cep":
      return [...SIGNUP_CEP_REPLIES, SIGNUP_CANCEL];
    case "signup_name":
    case "signup_birthdate":
      return [SIGNUP_CANCEL];
    default:
      return [];
  }
}

export function getQuickReplies(
  state: OrchestratorState,
  isAuthenticated: boolean,
  availableActions: string[],
  hasPendingOffer: boolean,
  lastAssistantMessage: string | null,
  personas: DemoPersona[] = [],
  signupEnabled = false
): QuickReply[] {
  // No celular nao ha painel lateral: os chips sao a unica porta de entrada visivel
  // para quem nao conhece nenhum CPF desta base.
  if (state === "collecting_cpf" || state === "welcome") {
    const personaChips: QuickReply[] = personas.map((persona) => ({
      label: `Entrar como ${persona.primeiro_nome} (${persona.score})`,
      message: "",
      personaId: persona.id,
    }));
    if (signupEnabled) personaChips.push(SIGNUP_REPLY);
    return personaChips;
  }

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
  personas = [],
  signupEnabled = false,
  disabled,
  onSelect,
  onSelectPersona,
}: QuickRepliesProps) {
  const replies = getQuickReplies(
    state,
    isAuthenticated,
    availableActions,
    hasPendingOffer,
    lastAssistantMessage,
    personas,
    signupEnabled
  );

  if (replies.length === 0) return null;

  return (
    <div
      className="scrollbar-none flex gap-2 overflow-x-auto px-4 pt-3 md:flex-wrap md:overflow-visible md:px-6"
      role="group"
      aria-label="Respostas sugeridas"
    >
      {replies.map((reply) => (
        <button
          key={reply.label}
          type="button"
          disabled={disabled}
          onClick={() =>
            reply.personaId ? onSelectPersona?.(reply.personaId) : onSelect(reply.message)
          }
          className={cn(
            "h-8 shrink-0 whitespace-nowrap rounded border px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 disabled:cursor-not-allowed disabled:opacity-50",
            reply.variant === "subtle"
              ? "border-line bg-surface text-ink-muted hover:bg-surface-muted hover:text-ink"
              : "border-line-strong bg-surface text-navy hover:border-navy hover:bg-navy-tint"
          )}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
}
