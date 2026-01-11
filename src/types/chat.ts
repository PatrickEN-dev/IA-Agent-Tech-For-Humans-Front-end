export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  type?: MessageType;
  data?: Record<string, unknown>;
}

export type MessageType =
  | "text"
  | "credit_info"
  | "exchange_info"
  | "interview_result"
  | "limit_result"
  | "error";

export type ChatState =
  | "welcome"
  | "collecting_cpf"
  | "collecting_birthdate"
  | "collecting_limit"
  | "collecting_interview"
  | "authenticated"
  | "chat"
  | "goodbye";

export type InterviewStep =
  | "renda"
  | "emprego"
  | "despesas"
  | "dependentes"
  | "dividas"
  | "complete";

export type ApiStatus = "checking" | "online" | "offline";

export interface ChatContextValue {
  messages: ChatMessage[];
  isLoading: boolean;
  apiStatus: ApiStatus;
  currentState: ChatState;
  addMessage: (role: MessageRole, content: string) => void;
  sendMessage: (message: string) => Promise<void>;
  resetChat: () => void;
}
