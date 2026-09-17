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
  | "interview_confirm"
  | "exchange_flow"
  | "exchange_from"
  | "exchange_to"
  | "signup_name"
  | "signup_birthdate"
  | "signup_cpf"
  | "signup_cep"
  | "goodbye";

export type AgentType = "triage" | "credit" | "interview" | "exchange";

// Acao listada em `available_actions` enquanto um fluxo de coleta esta aberto
export const CANCEL_ACTION = "cancelar";

export type ConnectionStatus = "connecting" | "online" | "offline";

// ---------------------------------------------------------------- demonstração

/** Cliente pronto para entrar em um clique, montado pelo back-end a partir do seed. */
export interface DemoPersona {
  id: string;
  nome: string;
  primeiro_nome: string;
  cpf: string;
  cpf_formatado: string;
  data_nascimento: string;
  score: number;
  limite_atual: number;
  max_limit_for_score: number;
  perfil: string;
}

export interface DemoPersonasResponse {
  demo_mode: boolean;
  signup_enabled: boolean;
  aviso: string;
  personas: DemoPersona[];
}

// ---------------------------------------------------------------- auto-cadastro

export interface SignupRequest {
  nome: string;
  cpf?: string | null;
  data_nascimento: string;
  email?: string | null;
  cep?: string | null;
}

export interface SignupResponse {
  cpf: string;
  cpf_formatado: string;
  nome: string;
  data_nascimento: string;
  score: number;
  current_limit: number;
  max_limit_for_score: number;
  cidade?: string | null;
  uf?: string | null;
  endereco?: string | null;
  cpf_provider: string;
  cpf_verified_externally: boolean;
  message: string;
}

export interface SuggestedCpfResponse {
  cpf: string;
  cpf_formatado: string;
  aviso: string;
}

// ---------------------------------------------------------------- retomada

/** Estado devolvido por GET /unified/session/{id}, usado para sobreviver a um F5. */
export interface SessionSnapshot {
  session_id: string;
  state: OrchestratorState;
  authenticated: boolean;
  user_name?: string | null;
  current_agent: AgentType;
  available_actions: string[];
  messages: { role: "user" | "assistant"; content: string }[];
}
