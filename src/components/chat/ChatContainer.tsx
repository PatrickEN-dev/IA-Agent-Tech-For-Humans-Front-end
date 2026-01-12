"use client";

import { useCallback, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatFooter } from "./ChatFooter";

export function ChatContainer() {
  const {
    messages,
    isLoading,
    currentState,
    currentAgent,
    isAuthenticated,
    messagesEndRef,
    sendMessage,
    resetChat,
  } = useChat();

  const [shouldReinit, setShouldReinit] = useState(false);

  useEffect(() => {
    if (shouldReinit && currentState === "WELCOME") {
      setShouldReinit(false);
    }
  }, [shouldReinit, currentState]);

  const handleLogout = useCallback(() => {
    resetChat();
    setShouldReinit(true);
  }, [resetChat]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;
      await sendMessage(message);
    },
    [sendMessage]
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader
        showLogout={isAuthenticated}
        onLogout={handleLogout}
        currentAgent={currentAgent}
        currentState={currentState}
        isAuthenticated={isAuthenticated}
      />
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
