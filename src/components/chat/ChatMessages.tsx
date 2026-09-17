"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowDown, Loader2, RefreshCw } from "lucide-react";
import type { ChatMessage as ChatMessageType, MessageRole, MessageVariant } from "@/types/chat";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatTime } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  isInitializing: boolean;
  isWakingUp: boolean;
  initFailed: boolean;
  userName: string | null;
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

/** Mensagens seguidas do mesmo autor (em poucos minutos) viram um grupo com um remetente e um horário. */
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
    <div
      className="flex items-start gap-2 rounded border border-danger/30 bg-danger-tint px-3 py-2 text-sm text-danger"
      role="alert"
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

function ConnectingState({ isWakingUp }: { isWakingUp: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <Loader2 size={20} className="animate-spin text-ink-muted" aria-hidden="true" />
      <p className="text-sm font-medium text-ink">Conectando ao assistente</p>
      {isWakingUp && (
        <p className="max-w-xs text-xs text-ink-muted" role="status">
          O servidor está iniciando. Na primeira visita isso pode levar cerca de um minuto.
        </p>
      )}
    </div>
  );
}

export function ChatMessages({
  messages,
  isLoading,
  isInitializing,
  isWakingUp,
  initFailed,
  userName,
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
    <div className="relative flex-1 overflow-hidden bg-surface-muted">
      <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto">
        {isInitializing ? (
          <ConnectingState isWakingUp={isWakingUp} />
        ) : (
          <div className="space-y-5 px-4 py-5 md:px-6" role="log" aria-live="polite">
            {groups.map((group) => {
              if (group.variant === "error") {
                return <SystemNotice key={group.id} text={group.messages[0].content} />;
              }

              const isUser = group.role === "user";
              const firstMessage = group.messages[0];
              const sender = isUser ? (userName ?? "Você") : "Assistente Banco Ágil";

              return (
                <div key={group.id} className={cn("flex gap-3", isUser && "flex-row-reverse")}>
                  <div className="shrink-0 pt-5">
                    <Avatar variant={isUser ? "user" : "assistant"} initial={userName ? userName.charAt(0) : null} />
                  </div>
                  <div className={cn("flex min-w-0 max-w-[85%] flex-col gap-1.5 md:max-w-[75%]", isUser && "items-end")}>
                    <div className="flex items-baseline gap-2 text-xs text-ink-muted">
                      <span className="font-medium text-ink">{sender}</span>
                      <time dateTime={firstMessage.timestamp.toISOString()} className="tabular-nums">
                        {formatTime(firstMessage.timestamp)}
                      </time>
                    </div>
                    {group.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} isUser={isUser} />
                    ))}
                  </div>
                </div>
              );
            })}

            {isLoading && <TypingIndicator />}

            {initFailed && !isLoading && (
              <div>
                <Button variant="secondary" size="sm" onClick={onRetry}>
                  <RefreshCw size={14} aria-hidden="true" />
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
          className="absolute bottom-3 right-4 inline-flex h-8 items-center gap-1.5 rounded border border-line-strong bg-surface px-2.5 text-xs font-medium text-ink shadow-sm transition-colors hover:bg-surface-muted animate-fade-in"
          aria-label="Ir para a última mensagem"
        >
          <ArrowDown size={14} aria-hidden="true" />
          Última mensagem
        </button>
      )}
    </div>
  );
}
