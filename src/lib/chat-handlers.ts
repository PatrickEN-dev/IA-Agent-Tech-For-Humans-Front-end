import { apiService } from "@/services/api.service";
import { formatCurrency } from "@/lib/utils";
import { MESSAGES } from "@/constants/messages";

export async function handleCreditLimit(): Promise<string> {
  const creditInfo = await apiService.getCreditLimit();

  if (!creditInfo) {
    return "Não foi possível obter as informações de crédito no momento. Tente novamente mais tarde.";
  }

  return `Informacoes do seu Credito

- Limite Total: ${formatCurrency(creditInfo.current_limit)}
- Limite Disponivel: ${formatCurrency(creditInfo.available_limit)}
- Score: ${creditInfo.score} pontos

${MESSAGES.CONTINUE_HELP}`;
}

export async function handleExchangeRates(): Promise<string> {
  const [exchangeUSD, exchangeEUR] = await Promise.all([
    apiService.getExchangeRate("BRL", "USD"),
    apiService.getExchangeRate("BRL", "EUR"),
  ]);

  if (!exchangeUSD || !exchangeEUR) {
    return "Não foi possível obter as cotações no momento. Tente novamente mais tarde.";
  }

  return `Cotacoes de Hoje

- Dolar (USD): R$ ${(1 / exchangeUSD.rate).toFixed(2)}
- Euro (EUR): R$ ${(1 / exchangeEUR.rate).toFixed(2)}

Atualizado em: ${new Date(exchangeUSD.timestamp).toLocaleString("pt-BR")}

${MESSAGES.CONTINUE_HELP}`;
}

export async function handleLimitIncrease(value: number): Promise<string> {
  const response = await apiService.requestLimitIncrease({ new_limit: value });

  if (!response) {
    return "Não foi possível processar sua solicitação de aumento de limite no momento. Tente novamente mais tarde.";
  }

  const statusMap: Record<string, string> = {
    approved: "APROVADO",
    pending_analysis: "EM ANALISE",
    denied: "NEGADO",
  };

  return `Resultado da Solicitacao

Status: ${statusMap[response.status] || response.status}

${response.message}

${MESSAGES.CONTINUE_HELP}`;
}

export type IntentType =
  | "credit_limit"
  | "limit_increase"
  | "exchange"
  | "interview"
  | "goodbye"
  | "help"
  | "unknown";

export function detectIntent(input: string): IntentType {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("limite") && !lowerInput.includes("aument")) {
    return "credit_limit";
  }

  if (lowerInput.includes("aumento") || lowerInput.includes("aumentar")) {
    return "limit_increase";
  }

  if (
    lowerInput.includes("cambio") ||
    lowerInput.includes("dolar") ||
    lowerInput.includes("euro") ||
    lowerInput.includes("cotacao")
  ) {
    return "exchange";
  }

  if (
    lowerInput.includes("perfil") ||
    lowerInput.includes("entrevista") ||
    lowerInput.includes("atualizar")
  ) {
    return "interview";
  }

  if (
    lowerInput.includes("sair") ||
    lowerInput.includes("encerrar") ||
    lowerInput.includes("tchau") ||
    lowerInput.includes("adeus")
  ) {
    return "goodbye";
  }

  if (
    lowerInput.includes("ajuda") ||
    lowerInput.includes("help") ||
    lowerInput.includes("opcoes")
  ) {
    return "help";
  }

  return "unknown";
}
