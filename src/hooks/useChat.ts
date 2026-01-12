"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { apiService } from "@/services/api.service";
import type { ChatMessage } from "@/types/chat";
import type { OrchestratorState, AgentType, ApiError } from "@/types/api";
import { AxiosError } from "axios";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  currentState: OrchestratorState;
  currentAgent: AgentType;
  isAuthenticated: boolean;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  sendMessage: (message: string) => Promise<void>;
  resetChat: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentState, setCurrentState] = useState<OrchestratorState>("WELCOME");
  const [currentAgent, setCurrentAgent] = useState<AgentType>("triage");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
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

  const handleApiError = useCallback((err: unknown): string => {
    if (err instanceof AxiosError) {
      const data = err.response?.data as ApiError | undefined;

      if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND" || err.code === "ERR_NETWORK") {
        return "Servidor indisponível. Verifique se o backend está rodando.";
      }

      switch (err.response?.status) {
        case 400:
          return data?.detail || "Dados inválidos";
        case 401:
          return "Sessão expirada. Faça login novamente.";
        case 404:
          return "Recurso não encontrado.";
        case 422:
          return data?.detail || "Erro de validação";
        case 429:
          return `Muitas tentativas. ${data?.remaining_attempts !== undefined ? `Restam ${data.remaining_attempts} tentativas.` : ""}`;
        case 500:
          return "Erro interno. Tente novamente.";
        default:
          return data?.detail || "Erro desconhecido";
      }
    }
    return "Erro de conexão";
  }, []);

  const initializeChat = useCallback(async () => {
    if (isInitialized) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.initUnifiedChat();

      setCurrentState(response.state);
      setCurrentAgent(response.current_agent);
      setIsAuthenticated(response.authenticated);
      setIsInitialized(true);

      addMessage("assistant", response.message);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      addMessage("assistant", `Erro ao inicializar: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, addMessage, handleApiError]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      const userMessage = message.trim();
      setError(null);

      addMessage("user", userMessage);
      setIsLoading(true);

      try {
        const response = await apiService.sendUnifiedMessage(userMessage);

        setCurrentState(response.state);
        setCurrentAgent(response.current_agent);
        setIsAuthenticated(response.authenticated);

        addMessage("assistant", response.message);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        addMessage("assistant", `Desculpe, ocorreu um erro: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage, handleApiError]
  );

  const resetChat = useCallback(() => {
    apiService.logout();
    setMessages([]);
    setCurrentState("WELCOME");
    setCurrentAgent("triage");
    setIsAuthenticated(false);
    setError(null);
    setIsInitialized(false);
  }, []);

  return {
    messages,
    isLoading,
    currentState,
    currentAgent,
    isAuthenticated,
    error,
    messagesEndRef,
    sendMessage,
    resetChat,
  };
}
