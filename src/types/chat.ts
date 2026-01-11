export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export type ChatState = "welcome" | "collecting_cpf" | "collecting_birthdate" | "chat" | "goodbye";

export type ApiStatus = "checking" | "online" | "offline";
