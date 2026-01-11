export interface AuthRequest {
  cpf: string;
  birthdate: string;
  user_message?: string;
}

export interface LimitIncreaseRequest {
  new_limit: number;
}

export interface InterviewRequest {
  renda_mensal: number;
  tipo_emprego: EmploymentType;
  despesas: number;
  num_dependentes: number;
  tem_dividas: boolean;
}

export interface ExchangeRequest {
  from: string;
  to: string;
}

export interface HealthResponse {
  status: "healthy" | "unhealthy";
}

export interface AuthResponse {
  authenticated: boolean;
  token: string | null;
  redirect_intent: RedirectIntent | null;
  remaining_attempts: number;
}

export interface CreditLimitResponse {
  cpf: string;
  current_limit: number;
  available_limit: number;
  score: number;
}

export interface LimitIncreaseResponse {
  cpf: string;
  requested_limit: number;
  status: LimitRequestStatus;
  message: string;
}

export interface InterviewResponse {
  cpf: string;
  previous_score: number;
  new_score: number;
  recommendation: string;
  redirect_to: string;
}

export interface ExchangeRateResponse {
  from_currency: string;
  to_currency: string;
  rate: number;
  timestamp: string;
  message: string;
}

export interface APIError {
  detail: string;
}

export type EmploymentType = "CLT" | "FORMAL" | "PUBLICO" | "AUTONOMO" | "MEI" | "DESEMPREGADO";

export type RedirectIntent = "credit_limit" | "request_increase" | "exchange_rate" | "interview";

export type LimitRequestStatus = "approved" | "pending_analysis" | "denied";
