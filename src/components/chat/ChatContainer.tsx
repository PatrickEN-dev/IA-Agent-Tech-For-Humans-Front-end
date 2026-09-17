"use client";

import { useChat } from "@/hooks/useChat";
import type { ConnectionStatus } from "@/types/api";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatFooter } from "./ChatFooter";

export function ChatContainer() {
  const {
    messages,
    isLoading,
    isReady,
    isWakingUp,
    initFailed,
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
  } = useChat();

  const isInitializing = !isReady && messages.length === 0 && !initFailed;
  const connection: ConnectionStatus = initFailed ? "offline" : isReady ? "online" : "connecting";

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-surface md:mx-auto md:h-[min(52rem,calc(100dvh-3rem))] md:max-w-3xl md:rounded-3xl md:border md:border-line md:shadow-card">
      <ChatHeader
        connection={connection}
        currentAgent={currentAgent}
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLogout={resetChat}
      />
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        isInitializing={isInitializing}
        isWakingUp={isWakingUp}
        initFailed={initFailed}
        userInitial={userName ? userName.charAt(0) : null}
        onRetry={retryInit}
        messagesEndRef={messagesEndRef}
      />
      {!isInitializing && (
        <ChatFooter
          currentState={currentState}
          isAuthenticated={isAuthenticated}
          availableActions={availableActions}
          hasPendingOffer={hasPendingOffer}
          lastAssistantMessage={lastAssistantMessage}
          isLoading={isLoading}
          onSend={sendMessage}
          onRestart={resetChat}
        />
      )}
    </div>
  );
}
