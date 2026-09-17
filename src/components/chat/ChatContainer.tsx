"use client";

import { useChat } from "@/hooks/useChat";
import type { ConnectionStatus } from "@/types/api";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatFooter } from "./ChatFooter";
import { SessionPanel } from "./SessionPanel";

export function ChatContainer() {
  const {
    messages,
    personas,
    demoNotice,
    signupEnabled,
    loginAsPersona,
    isLoading,
    isReady,
    isWakingUp,
    initFailed,
    sessionId,
    currentState,
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
    <div className="flex h-[100dvh] flex-col">
      <ChatHeader
        connection={connection}
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLogout={resetChat}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-4 overflow-hidden md:p-4">
        <section
          className="flex min-w-0 flex-1 flex-col overflow-hidden bg-surface md:rounded md:border md:border-line"
          aria-label="Conversa com o assistente"
        >
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            isInitializing={isInitializing}
            isWakingUp={isWakingUp}
            initFailed={initFailed}
            userName={userName}
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
              personas={personas}
              signupEnabled={signupEnabled}
              demoNotice={demoNotice}
              onSend={sendMessage}
              onRestart={resetChat}
              onSelectPersona={loginAsPersona}
            />
          )}
        </section>

        <div className="hidden w-[300px] shrink-0 md:block">
          <SessionPanel
            connection={connection}
            currentState={currentState}
            isAuthenticated={isAuthenticated}
            userName={userName}
            sessionId={sessionId}
            availableActions={availableActions}
            personas={personas}
            signupEnabled={signupEnabled}
            disabled={isLoading}
            onSelect={sendMessage}
            onSelectPersona={loginAsPersona}
          />
        </div>
      </div>
    </div>
  );
}
