"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useInterview } from "@/hooks/useInterview";
import { useChatHandlers } from "@/hooks/useChatHandlers";
import { MESSAGES } from "@/constants/messages";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatFooter } from "./ChatFooter";

export function ChatContainer() {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationRef = useRef(false);
  const { cpf, setCpf, authenticate, logout } = useAuth();

  const {
    messages,
    isLoading,
    currentState,
    messagesEndRef,
    addMessage,
    setIsLoading,
    setCurrentState,
    resetChat,
  } = useChat();

  const handleInterviewComplete = useCallback(
    (message: string) => {
      addMessage("assistant", message);
      setCurrentState("chat");
    },
    [addMessage, setCurrentState]
  );

  const handleInterviewError = useCallback(
    (message: string) => {
      addMessage("assistant", message);
      setCurrentState("chat");
    },
    [addMessage, setCurrentState]
  );

  const { processInput: processInterviewInput, reset: resetInterview } = useInterview(
    handleInterviewComplete,
    handleInterviewError
  );

  const {
    handleCpfInput,
    handleBirthdateInput,
    handleLimitInput,
    handleChatInput,
    handleInterviewInput,
  } = useChatHandlers({
    cpf,
    setCpf,
    authenticate,
    addMessage,
    setCurrentState,
    processInterviewInput,
  });

  useEffect(() => {
    if (!initializationRef.current && messages.length === 0 && !isInitialized) {
      initializationRef.current = true;
      setIsInitialized(true);
      addMessage("assistant", MESSAGES.WELCOME);
      setCurrentState("collecting_cpf");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    resetChat();
    resetInterview();
    setIsInitialized(false);
    initializationRef.current = false;
  }, [logout, resetChat, resetInterview]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      addMessage("user", message);
      setIsLoading(true);

      try {
        switch (currentState) {
          case "collecting_cpf":
            await handleCpfInput(message);
            break;
          case "collecting_birthdate":
            await handleBirthdateInput(message);
            break;
          case "collecting_limit":
            await handleLimitInput(message);
            break;
          case "collecting_interview":
            await handleInterviewInput(message);
            break;
          case "chat":
            await handleChatInput(message);
            break;
        }
      } catch (err) {
        console.error("Error:", err);
        addMessage("assistant", MESSAGES.GENERIC_ERROR);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentState,
      addMessage,
      setIsLoading,
      handleCpfInput,
      handleBirthdateInput,
      handleLimitInput,
      handleChatInput,
      handleInterviewInput,
    ]
  );

  const showLogout = currentState !== "welcome" && currentState !== "collecting_cpf";

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader showLogout={showLogout} onLogout={handleLogout} />
      <ChatMessages messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
      <ChatFooter
        currentState={currentState}
        isLoading={isLoading}
        onSend={handleSendMessage}
        onRestart={handleLogout}
      />
    </div>
  );
}
