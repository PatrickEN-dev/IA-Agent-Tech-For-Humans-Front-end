export interface UnifiedChatRequest {
  session_id?: string;
  message: string;
}

export interface RedirectAction {
  should_redirect: boolean;
  target_agent?: string;
  reason?: string;
  suggested_action?: string;
}

export interface UnifiedChatResponse {
  session_id: string;
  message: string;
  state: OrchestratorState;
  authenticated: boolean;
  token?: string | null;
  user_name?: string | null;
  current_agent: AgentType;
  available_actions: string[];
  redirect_suggestion?: RedirectAction | null;
}

// FastAPI devolve `detail` como string nos erros de negocio, como objeto na autenticacao
// direta e como lista nos erros de validacao (422).
export type ApiErrorDetail =
  | string
  | { message?: string; remaining_attempts?: number }
  | Array<{ msg?: string; loc?: unknown[] }>;

export interface ApiError {
  detail?: ApiErrorDetail;
  remaining_attempts?: number;
}

// Valores exatamente como o backend devolve em `state` (src/agents/orchestrator.py)
export type OrchestratorState =
  | "welcome"
  | "collecting_cpf"
  | "collecting_birthdate"
  | "authenticated"
  | "credit_flow"
  | "credit_increase_flow"
  | "interview_flow"
  | "interview_income"
  | "interview_employment"
  | "interview_expenses"
  | "interview_dependents"
  | "interview_debts"
  | "exchange_flow"
  | "exchange_from"
  | "exchange_to"
  | "goodbye";

export type AgentType = "triage" | "credit" | "interview" | "exchange";

// Acao listada em `available_actions` enquanto um fluxo de coleta esta aberto
export const CANCEL_ACTION = "cancelar";

export type ConnectionStatus = "connecting" | "online" | "offline";
