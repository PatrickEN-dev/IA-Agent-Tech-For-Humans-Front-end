"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { apiService } from "@/services/api.service";
import type { ChatMessage, MessageVariant } from "@/types/chat";
import type { OrchestratorState, AgentType, ApiError, UnifiedChatResponse } from "@/types/api";
import { AxiosError } from "axios";

const INIT_MAX_ATTEMPTS = 3;
const INIT_RETRY_DELAY_MS = 1500;
// Depois disso sem resposta, avisamos que o servidor esta acordando (cold start do Render).
const WAKE_UP_NOTICE_MS = 4000;

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isWakingUp: boolean;
  initFailed: boolean;
  currentState: OrchestratorState;
  currentAgent: AgentType;
  isAuthenticated: boolean;
  availableActions: string[];
  hasPendingOffer: boolean;
  lastAssistantMessage: string | null;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  sendMessage: (message: string) => Promise<void>;
  resetChat: () => void;
  retryInit: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [initFailed, setInitFailed] = useState(false);
  const [currentState, setCurrentState] = useState<OrchestratorState>("welcome");
  const [currentAgent, setCurrentAgent] = useState<AgentType>("triage");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [hasPendingOffer, setHasPendingOffer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const initStartedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isWakingUp]);

  const lastAssistantMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant" && messages[i].variant !== "error") {
        return messages[i].content;
      }
    }
    return null;
  }, [messages]);

  const addMessage = useCallback(
    (role: "user" | "assistant", content: string, variant: MessageVariant = "default") => {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role,
          content,
          timestamp: new Date(),
          variant,
        },
      ]);
    },
    []
  );

  const applyResponse = useCallback(
    (response: UnifiedChatResponse) => {
      setCurrentState(response.state);
      setCurrentAgent(response.current_agent);
      setIsAuthenticated(response.authenticated);
      setAvailableActions(response.available_actions ?? []);
      setHasPendingOffer(Boolean(response.redirect_suggestion?.should_redirect));
      addMessage("assistant", response.message);
    },
    [addMessage]
  );

  const handleApiError = useCallback((err: unknown): string => {
    if (err instanceof AxiosError) {
      const data = err.response?.data as ApiError | undefined;

      if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
        return "O servidor demorou para responder. Tente novamente em alguns segundos.";
      }

      if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND" || err.code === "ERR_NETWORK") {
        return "Não foi possível conectar ao servidor. Verifique sua conexão.";
      }

      switch (err.response?.status) {
        case 400:
          return data?.detail || "Dados inválidos";
        case 401:
          return "Sessão expirada. Inicie um novo atendimento.";
        case 404:
          return "Recurso não encontrado.";
        case 422:
          return data?.detail || "Erro de validação";
        case 429:
          return `Muitas tentativas. ${data?.remaining_attempts !== undefined ? `Restam ${data.remaining_attempts} tentativas.` : ""}`;
        case 500:
        case 502:
        case 503:
          return "O servidor está indisponível no momento. Tente novamente.";
        default:
          return data?.detail || "Erro desconhecido";
      }
    }
    return "Erro de conexão";
  }, []);

  const initializeChat = useCallback(async () => {
    if (isInitialized || initStartedRef.current) return;
    initStartedRef.current = true;

    setIsLoading(true);
    setError(null);
    setInitFailed(false);

    const wakeUpTimer = setTimeout(() => setIsWakingUp(true), WAKE_UP_NOTICE_MS);

    try {
      for (let attempt = 1; attempt <= INIT_MAX_ATTEMPTS; attempt++) {
        try {
          const response = await apiService.initUnifiedChat();
          applyResponse(response);
          setIsInitialized(true);
          return;
        } catch (err) {
          if (attempt === INIT_MAX_ATTEMPTS) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            setInitFailed(true);
            initStartedRef.current = false;
            addMessage(
              "assistant",
              `Não consegui iniciar o atendimento. ${errorMessage}`,
              "error"
            );
          } else {
            await sleep(INIT_RETRY_DELAY_MS * attempt);
          }
        }
      }
    } finally {
      clearTimeout(wakeUpTimer);
      setIsWakingUp(false);
      setIsLoading(false);
    }
  }, [isInitialized, applyResponse, addMessage, handleApiError]);

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
        applyResponse(response);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        addMessage("assistant", errorMessage, "error");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage, applyResponse, handleApiError]
  );

  const resetChat = useCallback(() => {
    apiService.logout();
    setMessages([]);
    setCurrentState("welcome");
    setCurrentAgent("triage");
    setIsAuthenticated(false);
    setAvailableActions([]);
    setHasPendingOffer(false);
    setError(null);
    setInitFailed(false);
    initStartedRef.current = false;
    setIsInitialized(false);
  }, []);

  const retryInit = useCallback(() => {
    setMessages((prev) => prev.filter((m) => m.variant !== "error"));
    initStartedRef.current = false;
    void initializeChat();
  }, [initializeChat]);

  return {
    messages,
    isLoading,
    isWakingUp,
    initFailed,
    currentState,
    currentAgent,
    isAuthenticated,
    availableActions,
    hasPendingOffer,
    lastAssistantMessage,
    error,
    messagesEndRef,
    sendMessage,
    resetChat,
    retryInit,
  };
}
