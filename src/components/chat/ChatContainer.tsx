"use client";

import { useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatFooter } from "./ChatFooter";

export function ChatContainer() {
  const {
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
    messagesEndRef,
    sendMessage,
    resetChat,
    retryInit,
  } = useChat();

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;
      await sendMessage(message);
    },
    [sendMessage]
  );

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50">
      <ChatHeader
        showLogout={isAuthenticated}
        onLogout={resetChat}
        currentAgent={currentAgent}
        currentState={currentState}
        isAuthenticated={isAuthenticated}
      />
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        isWakingUp={isWakingUp}
        initFailed={initFailed}
        onRetry={retryInit}
        messagesEndRef={messagesEndRef}
      />
      <ChatFooter
        currentState={currentState}
        isAuthenticated={isAuthenticated}
        availableActions={availableActions}
        hasPendingOffer={hasPendingOffer}
        lastAssistantMessage={lastAssistantMessage}
        isLoading={isLoading}
        onSend={handleSendMessage}
        onRestart={resetChat}
      />
    </div>
  );
}
