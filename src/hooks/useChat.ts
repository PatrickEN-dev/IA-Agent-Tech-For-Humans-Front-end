"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { apiService } from "@/services/api.service";
import { describeApiDetail, generateId } from "@/lib/utils";
import type { ChatMessage, MessageVariant } from "@/types/chat";
import type {
  OrchestratorState,
  AgentType,
  ApiError,
  UnifiedChatResponse,
  DemoPersona,
  SessionSnapshot,
} from "@/types/api";
import { AxiosError } from "axios";

const INIT_MAX_ATTEMPTS = 3;
const INIT_RETRY_DELAY_MS = 1500;
// Depois disso sem resposta, avisamos que o servidor esta acordando (cold start do Render).
const WAKE_UP_NOTICE_MS = 4000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function describeApiError(err: unknown): string {
  if (!(err instanceof AxiosError)) {
    return "Erro de conexão";
  }

  const data = err.response?.data as ApiError | undefined;
  const detail = describeApiDetail(data?.detail);

  if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
    return "O servidor demorou para responder. Tente novamente em alguns segundos.";
  }

  if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND" || err.code === "ERR_NETWORK") {
    return "Não foi possível conectar ao servidor. Verifique sua conexão.";
  }

  switch (err.response?.status) {
    case 400:
      return detail || "Dados inválidos";
    case 401:
      return "Sessão expirada. Inicie um novo atendimento.";
    case 404:
      return "Recurso não encontrado.";
    case 422:
      return "Não consegui entender essa mensagem. Tente escrever de outra forma.";
    case 429: {
      const remaining = data?.remaining_attempts;
      return `Muitas tentativas.${remaining !== undefined ? ` Restam ${remaining} tentativas.` : ""}`;
    }
    case 500:
    case 502:
    case 503:
      return "O servidor está indisponível no momento. Tente novamente.";
    default:
      return detail || "Erro desconhecido";
  }
}

interface UseChatReturn {
  messages: ChatMessage[];
  /** Clientes de demonstracao; vazio quando o back-end nao esta em modo demo. */
  personas: DemoPersona[];
  demoNotice: string | null;
  signupEnabled: boolean;
  loginAsPersona: (personaId: string) => Promise<void>;
  isLoading: boolean;
  /** Sessao aberta com sucesso no back-end */
  isReady: boolean;
  isWakingUp: boolean;
  initFailed: boolean;
  sessionId: string | null;
  currentState: OrchestratorState;
  currentAgent: AgentType;
  isAuthenticated: boolean;
  userName: string | null;
  availableActions: string[];
  hasPendingOffer: boolean;
  lastAssistantMessage: string | null;
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<OrchestratorState>("welcome");
  const [currentAgent, setCurrentAgent] = useState<AgentType>("triage");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [hasPendingOffer, setHasPendingOffer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [personas, setPersonas] = useState<DemoPersona[]>([]);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const [signupEnabled, setSignupEnabled] = useState(false);
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
      setSessionId(response.session_id);
      setCurrentState(response.state);
      setCurrentAgent(response.current_agent);
      setIsAuthenticated(response.authenticated);
      setUserName(response.user_name ?? null);
      setAvailableActions(response.available_actions ?? []);
      setHasPendingOffer(Boolean(response.redirect_suggestion?.should_redirect));
      addMessage("assistant", response.message);
    },
    [addMessage]
  );

  const applySnapshot = useCallback((snapshot: SessionSnapshot) => {
    setSessionId(snapshot.session_id);
    setCurrentState(snapshot.state);
    setCurrentAgent(snapshot.current_agent);
    setIsAuthenticated(snapshot.authenticated);
    setUserName(snapshot.user_name ?? null);
    setAvailableActions(snapshot.available_actions ?? []);
    setHasPendingOffer(false);
    setMessages(
      snapshot.messages.map((m) => ({
        id: generateId(),
        role: m.role,
        content: m.content,
        timestamp: new Date(),
        variant: "default" as MessageVariant,
      }))
    );
  }, []);

  const initializeChat = useCallback(async () => {
    if (isInitialized || initStartedRef.current) return;
    initStartedRef.current = true;

    setIsLoading(true);
    setInitFailed(false);

    const wakeUpTimer = setTimeout(() => setIsWakingUp(true), WAKE_UP_NOTICE_MS);

    try {
      // Recarregar a pagina nao pode custar a conversa: tenta retomar antes de abrir
      // uma sessao nova. 404 (expirada ou servidor reiniciado) cai no init normal.
      try {
        const snapshot = await apiService.resumeSession();
        if (snapshot) {
          applySnapshot(snapshot);
          setIsInitialized(true);
          return;
        }
      } catch {
        // Retomada e um atalho, nunca um bloqueio.
      }

      for (let attempt = 1; attempt <= INIT_MAX_ATTEMPTS; attempt++) {
        try {
          const response = await apiService.initUnifiedChat();
          applyResponse(response);
          setIsInitialized(true);
          return;
        } catch (err) {
          if (attempt === INIT_MAX_ATTEMPTS) {
            setInitFailed(true);
            initStartedRef.current = false;
            addMessage(
              "assistant",
              `Não consegui iniciar o atendimento. ${describeApiError(err)}`,
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
  }, [isInitialized, applyResponse, applySnapshot, addMessage]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // Personas sao carregadas em paralelo e ignoradas em silencio fora do modo demo:
  // o chat precisa funcionar identico quando a demonstracao esta desligada.
  useEffect(() => {
    if (!isInitialized) return;
    let cancelled = false;

    void apiService.getPersonas().then((data) => {
      if (cancelled || !data?.demo_mode) return;
      setPersonas(data.personas);
      setDemoNotice(data.aviso);
      setSignupEnabled(data.signup_enabled);
    });

    return () => {
      cancelled = true;
    };
  }, [isInitialized]);

  const loginAsPersona = useCallback(
    async (personaId: string) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await apiService.demoLogin(personaId);
        applyResponse(response);
      } catch (err) {
        addMessage("assistant", describeApiError(err), "error");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, applyResponse, addMessage]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      const userMessage = message.trim();
      if (!userMessage || isLoading) return;

      addMessage("user", userMessage);
      setIsLoading(true);

      try {
        const response = await apiService.sendUnifiedMessage(userMessage);
        applyResponse(response);
      } catch (err) {
        addMessage("assistant", describeApiError(err), "error");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage, applyResponse]
  );

  const resetChat = useCallback(() => {
    apiService.logout();
    setMessages([]);
    setSessionId(null);
    setCurrentState("welcome");
    setCurrentAgent("triage");
    setIsAuthenticated(false);
    setUserName(null);
    setAvailableActions([]);
    setHasPendingOffer(false);
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
    personas,
    demoNotice,
    signupEnabled,
    loginAsPersona,
    isLoading,
    isReady: isInitialized,
    isWakingUp,
    initFailed,
    sessionId,
    currentState,
    currentAgent,
    isAuthenticated,
    userName,
    availableActions,
    hasPendingOffer,
    lastAssistantMessage,
    messagesEndRef,
    sendMessage,
    resetChat,
    retryInit,
  };
}
