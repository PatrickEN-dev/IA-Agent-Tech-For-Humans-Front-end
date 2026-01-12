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
  token?: string;
  current_agent: AgentType;
  available_actions: string[];
  redirect_suggestion?: RedirectAction;
}

export interface ApiError {
  detail: string;
  remaining_attempts?: number;
}

export type OrchestratorState =
  | "WELCOME"
  | "COLLECTING_CPF"
  | "COLLECTING_BIRTHDATE"
  | "AUTHENTICATED"
  | "CREDIT_FLOW"
  | "CREDIT_INCREASE_FLOW"
  | "INTERVIEW_FLOW"
  | "INTERVIEW_INCOME"
  | "INTERVIEW_EMPLOYMENT"
  | "INTERVIEW_EXPENSES"
  | "INTERVIEW_DEPENDENTS"
  | "INTERVIEW_DEBTS"
  | "EXCHANGE_FLOW"
  | "EXCHANGE_FROM"
  | "EXCHANGE_TO"
  | "GOODBYE";

export type AgentType = "triage" | "credit" | "interview" | "exchange";

export type IntentType =
  | "credit_limit"
  | "request_increase"
  | "exchange_rate"
  | "interview"
  | "other";

export interface HealthResponse {
  status: "healthy" | "unhealthy";
}
