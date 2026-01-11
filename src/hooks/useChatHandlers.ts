"use client";

import { useCallback } from "react";
import { cpfSchema, birthdateSchema } from "@/schemas/auth.schema";
import { limitRequestSchema } from "@/schemas/limit.schema";
import { MESSAGES } from "@/constants/messages";
import {
  detectIntent,
  handleCreditLimit,
  handleExchangeRates,
  handleLimitIncrease,
} from "@/lib/chat-handlers";
import type { ChatState } from "@/types/chat";
import type { AuthResponse } from "@/types/api";

interface UseChatHandlersProps {
  cpf: string;
  setCpf: (cpf: string) => void;
  authenticate: (cpf: string, birthdate: string) => Promise<AuthResponse | null>;
  addMessage: (role: "user" | "assistant", content: string) => void;
  setCurrentState: (state: ChatState) => void;
  processInterviewInput: (input: string) => Promise<string | null>;
}

export function useChatHandlers({
  cpf,
  setCpf,
  authenticate,
  addMessage,
  setCurrentState,
  processInterviewInput,
}: UseChatHandlersProps) {
  const handleCpfInput = useCallback(
    async (input: string) => {
      const result = cpfSchema.safeParse(input);
      if (!result.success) {
        addMessage("assistant", MESSAGES.CPF_INVALID);
        return;
      }
      setCpf(result.data);
      addMessage("assistant", MESSAGES.CPF_RECEIVED);
      setCurrentState("collecting_birthdate");
    },
    [setCpf, addMessage, setCurrentState]
  );

  const handleBirthdateInput = useCallback(
    async (input: string) => {
      const result = birthdateSchema.safeParse(input);
      if (!result.success) {
        addMessage("assistant", MESSAGES.BIRTHDATE_INVALID);
        return;
      }

      addMessage("assistant", MESSAGES.VALIDATING);

      try {
        const response = await authenticate(cpf, input);

        if (response && response.authenticated) {
          addMessage("assistant", MESSAGES.AUTH_SUCCESS);
          setCurrentState("chat");
        } else if (response) {
          addMessage("assistant", MESSAGES.AUTH_FAILURE(response.remaining_attempts));
          if (response.remaining_attempts > 0) {
            setCurrentState("collecting_cpf");
            setCpf("");
          } else {
            setCurrentState("goodbye");
          }
        } else {
          addMessage("assistant", MESSAGES.SERVER_ERROR);
          setCurrentState("collecting_cpf");
          setCpf("");
        }
      } catch {
        addMessage("assistant", MESSAGES.SERVER_ERROR);
        setCurrentState("collecting_cpf");
        setCpf("");
      }
    },
    [cpf, authenticate, addMessage, setCurrentState, setCpf]
  );

  const handleLimitInput = useCallback(
    async (input: string) => {
      const result = limitRequestSchema.safeParse(input);
      if (!result.success) {
        addMessage("assistant", MESSAGES.LIMIT_INVALID);
        return;
      }

      try {
        const message = await handleLimitIncrease(result.data);
        addMessage("assistant", message);
      } catch {
        addMessage("assistant", MESSAGES.LIMIT_ERROR);
      }
      setCurrentState("chat");
    },
    [addMessage, setCurrentState]
  );

  const handleChatInput = useCallback(
    async (input: string) => {
      const intent = detectIntent(input);

      switch (intent) {
        case "credit_limit":
          try {
            const message = await handleCreditLimit();
            addMessage("assistant", message);
          } catch {
            addMessage("assistant", MESSAGES.CREDIT_ERROR);
          }
          break;

        case "limit_increase":
          addMessage("assistant", MESSAGES.LIMIT_REQUEST_PROMPT);
          setCurrentState("collecting_limit");
          break;

        case "exchange":
          try {
            const message = await handleExchangeRates();
            addMessage("assistant", message);
          } catch {
            addMessage("assistant", MESSAGES.EXCHANGE_ERROR);
          }
          break;

        case "interview":
          addMessage("assistant", MESSAGES.INTERVIEW_START);
          setCurrentState("collecting_interview");
          break;

        case "goodbye":
          addMessage("assistant", MESSAGES.GOODBYE);
          setCurrentState("goodbye");
          break;

        case "help":
          addMessage("assistant", MESSAGES.HELP);
          break;

        default:
          addMessage("assistant", MESSAGES.NOT_UNDERSTOOD);
      }
    },
    [addMessage, setCurrentState]
  );

  const handleInterviewInput = useCallback(
    async (input: string) => {
      const response = await processInterviewInput(input);
      if (response) {
        addMessage("assistant", response);
      }
    },
    [processInterviewInput, addMessage]
  );

  return {
    handleCpfInput,
    handleBirthdateInput,
    handleLimitInput,
    handleChatInput,
    handleInterviewInput,
  };
}
