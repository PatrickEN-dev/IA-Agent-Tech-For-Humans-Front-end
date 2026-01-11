"use client";

import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useChatHandlers } from "@/hooks/useChatHandlers";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatFooter } from "./ChatFooter";

export function ChatContainer() {
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

  const { handleCpfInput, handleBirthdateInput, handleChatInput, handleGeneralInput } =
    useChatHandlers({
      cpf,
      setCpf,
      authenticate,
      addMessage,
      setCurrentState,
      messages,
    });

  const handleLogout = useCallback(() => {
    logout();
    resetChat();
  }, [logout, resetChat]);

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
          case "chat":
            await handleChatInput(message);
            break;
          default:
            await handleGeneralInput(message);
            break;
        }
      } catch (err) {
        console.error("Error:", err);
        addMessage("assistant", "Algo inesperado aconteceu. Tente novamente.");
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
      handleChatInput,
      handleGeneralInput,
    ]
  );

  const showLogout = currentState === "chat";

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
