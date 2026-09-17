export type MessageRole = "user" | "assistant";

export type MessageVariant = "default" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  variant?: MessageVariant;
}

export type ApiStatus = "checking" | "online" | "offline";
