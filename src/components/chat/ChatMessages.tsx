"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowDown, RefreshCw } from "lucide-react";
import type { ChatMessage as ChatMessageType, MessageRole, MessageVariant } from "@/types/chat";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn, formatTime } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  isInitializing: boolean;
  isWakingUp: boolean;
  initFailed: boolean;
  userInitial: string | null;
  onRetry: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

interface MessageGroup {
  id: string;
  role: MessageRole;
  variant: MessageVariant;
  messages: ChatMessageType[];
}

const GROUP_WINDOW_MS = 3 * 60_000;
const SCROLL_BUTTON_THRESHOLD_PX = 160;

/** Mensagens seguidas do mesmo autor (em poucos minutos) viram um grupo com um avatar e um horário. */
function groupMessages(messages: ChatMessageType[]): MessageGroup[] {
  const groups: MessageGroup[] = [];

  for (const message of messages) {
    const variant = message.variant ?? "default";
    const last = groups[groups.length - 1];
    const lastMessage = last?.messages[last.messages.length - 1];
    const closeInTime = lastMessage
      ? message.timestamp.getTime() - lastMessage.timestamp.getTime() < GROUP_WINDOW_MS
      : false;

    if (last && last.role === message.role && last.variant === "default" && variant === "default" && closeInTime) {
      last.messages.push(message);
    } else {
      groups.push({ id: message.id, role: message.role, variant, messages: [message] });
    }
  }

  return groups;
}

function SystemNotice({ text }: { text: string }) {
  return (
    <div className="flex justify-center">
      <div
        className="flex max-w-[90%] items-start gap-2 rounded-xl border border-danger/30 bg-danger-soft px-3 py-2 text-xs text-danger"
        role="alert"
      >
        <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>{text}</span>
      </div>
    </div>
  );
}

function ConnectingState({ isWakingUp }: { isWakingUp: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center animate-fade-in">
      <BrandMark size={56} className="animate-pulse" />
      <div>
        <p className="font-medium text-ink">Conectando ao assistente…</p>
        {isWakingUp && (
          <p className="mt-1 max-w-xs text-xs text-ink-muted" role="status">
            O servidor está iniciando. Na primeira visita isso pode levar cerca de um minuto.
          </p>
        )}
      </div>
    </div>
  );
}

export function ChatMessages({
  messages,
  isLoading,
  isInitializing,
  isWakingUp,
  initFailed,
  userInitial,
  onRetry,
  messagesEndRef,
}: ChatMessagesProps) {
  const groups = useMemo(() => groupMessages(messages), [messages]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollButton(distanceFromBottom > SCROLL_BUTTON_THRESHOLD_PX);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef]);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto">
        {isInitializing ? (
          <ConnectingState isWakingUp={isWakingUp} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 px-4 py-5" role="log" aria-live="polite">
            {groups.map((group) => {
              if (group.variant === "error") {
                return <SystemNotice key={group.id} text={group.messages[0].content} />;
              }

              const isUser = group.role === "user";
              const lastMessage = group.messages[group.messages.length - 1];

              return (
                <div key={group.id} className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
                  <div className="w-8 shrink-0 pt-0.5">
                    <Avatar variant={isUser ? "user" : "assistant"} initial={isUser ? userInitial : null} />
                  </div>
                  <div className={cn("flex max-w-[82%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
                    {group.messages.map((message, index) => (
                      <ChatMessage key={message.id} message={message} isUser={isUser} isFirst={index === 0} />
                    ))}
                    <time
                      dateTime={lastMessage.timestamp.toISOString()}
                      className="px-1 text-[11px] text-ink-muted"
                    >
                      {formatTime(lastMessage.timestamp)}
                    </time>
                  </div>
                </div>
              );
            })}

            {isLoading && <TypingIndicator />}

            {initFailed && !isLoading && (
              <div className="flex justify-center">
                <Button variant="secondary" size="sm" onClick={onRetry}>
                  <RefreshCw size={14} />
                  Tentar novamente
                </Button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {showScrollButton && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-3 right-4 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-muted shadow-float transition-colors hover:text-ink animate-fade-in"
          aria-label="Ir para a última mensagem"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
}
