"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage, ChatState } from "@/types/chat";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  currentState: ChatState;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  addMessage: (role: "user" | "assistant", content: string) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentState: (state: ChatState) => void;
  resetChat: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentState, setCurrentState] = useState<ChatState>("welcome");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        role,
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setCurrentState("welcome");
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    currentState,
    messagesEndRef,
    addMessage,
    setIsLoading,
    setCurrentState,
    resetChat,
  };
}
