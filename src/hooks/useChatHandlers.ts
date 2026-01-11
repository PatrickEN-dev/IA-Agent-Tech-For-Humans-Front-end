"use client";

import { useCallback } from "react";
import { apiService } from "@/services/api.service";
import type { ChatState, ChatMessage } from "@/types/chat";
import type { AuthResponse, ChatRequest } from "@/types/api";

interface UseChatHandlersProps {
  cpf: string;
  setCpf: (cpf: string) => void;
  authenticate: (cpf: string, birthdate: string) => Promise<AuthResponse | null>;
  addMessage: (role: "user" | "assistant", content: string) => void;
  setCurrentState: (state: ChatState) => void;
  messages: ChatMessage[];
}

export function useChatHandlers({
  cpf,
  setCpf,
  authenticate,
  addMessage,
  setCurrentState,
  messages,
}: UseChatHandlersProps) {
  const sendMessageToBackend = useCallback(
    async (userMessage: string) => {
      try {
        const conversationHistory = messages.slice(-10).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const chatRequest: ChatRequest = {
          message: userMessage,
          conversation_history: conversationHistory,
        };

        const response = await apiService.sendChatMessage(chatRequest);

        if (response) {
          addMessage("assistant", response.response);

          if (response.requires_auth && !apiService.isAuthenticated()) {
            setCurrentState("collecting_cpf");
          }
        } else {
          addMessage("assistant", "Algo inesperado aconteceu. Tente novamente.");
        }
      } catch {
        addMessage(
          "assistant",
          "Algo inesperado aconteceu. Verifique sua conexão e tente novamente."
        );
      }
    },
    [addMessage, messages, setCurrentState]
  );

  const handleCpfInput = useCallback(
    async (input: string) => {
      const cleanCpf = input.replace(/\D/g, "");
      setCpf(cleanCpf);

      await sendMessageToBackend(input);
    },
    [setCpf, sendMessageToBackend]
  );

  const handleBirthdateInput = useCallback(
    async (input: string) => {
      try {
        const response = await authenticate(cpf, input);

        if (response && response.authenticated) {
          setCurrentState("chat");
        } else if (response) {
          if (response.remaining_attempts > 0) {
            setCurrentState("collecting_cpf");
            setCpf("");
          } else {
            setCurrentState("goodbye");
          }
        } else {
          setCurrentState("collecting_cpf");
          setCpf("");
        }
      } catch {
        setCurrentState("collecting_cpf");
        setCpf("");
      }
    },
    [cpf, authenticate, setCurrentState, setCpf]
  );

  const handleChatInput = useCallback(
    async (input: string) => {
      await sendMessageToBackend(input);
    },
    [sendMessageToBackend]
  );

  const handleGeneralInput = useCallback(
    async (input: string) => {
      await sendMessageToBackend(input);
    },
    [sendMessageToBackend]
  );

  return {
    handleCpfInput,
    handleBirthdateInput,
    handleChatInput,
    handleGeneralInput,
  };
}
