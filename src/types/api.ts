export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

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
  current_agent: AgentType;
  available_actions: string[];
  redirect_suggestion?: RedirectAction | null;
}

export interface ApiError {
  detail: string;
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

export type IntentType =
  | "credit_limit"
  | "request_increase"
  | "exchange_rate"
  | "interview"
  | "greeting"
  | "goodbye"
  | "confirm"
  | "reject"
  | "off_topic"
  | "other";

export interface HealthResponse {
  status: "healthy" | "unhealthy";
}
