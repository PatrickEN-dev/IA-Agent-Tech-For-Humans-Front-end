"use client";

import type { ReactNode } from "react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
  isUser: boolean;
  /** Primeira bolha do grupo recebe o canto "colado" ao avatar. */
  isFirst: boolean;
}

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "kv"; rows: { label: string; value: string }[] };

// "Seu limite atual: R$ 1.000,00" -> linha de dados. Rótulo curto, sem pontuação; valor sem frase.
const KV_LINE = /^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ ]{1,30}):\s+(.{1,60})$/;

function asKeyValue(line: string): { label: string; value: string } | null {
  const match = line.match(KV_LINE);
  if (!match) return null;
  const label = match[1].trim();
  const value = match[2].trim();
  if (label.split(" ").length > 3) return null;
  if (/[.?!]$/.test(value)) return null;
  return { label, value };
}

/** Converte o texto do back-end (linhas, "- item", "Rótulo: valor", **negrito**) em blocos. */
export function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "p", text: paragraph.join("\n") });
      paragraph = [];
    }
  };

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("• ")) {
      flushParagraph();
      const last = blocks[blocks.length - 1];
      const item = line.slice(2).trim();
      if (last && last.type === "ul") last.items.push(item);
      else blocks.push({ type: "ul", items: [item] });
      continue;
    }

    const kv = asKeyValue(line);
    if (kv) {
      flushParagraph();
      const last = blocks[blocks.length - 1];
      if (last && last.type === "kv") last.rows.push(kv);
      else blocks.push({ type: "kv", rows: [kv] });
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function RichContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        if (block.type === "ul") {
          return (
            <ul key={i} className="space-y-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "kv") {
          return (
            <dl
              key={i}
              className="min-w-[14rem] divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface sm:min-w-[17rem]"
            >
              {block.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 px-3 py-1.5">
                  <dt className="shrink-0 text-xs text-ink-muted">{row.label}</dt>
                  <dd className="text-right text-sm font-semibold tabular-nums text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          );
        }

        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export function ChatMessage({ message, isUser, isFirst }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "max-w-full animate-message-in rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-bubble",
        isUser
          ? "bg-gradient-to-br from-brand to-brand-strong text-white"
          : "bg-surface-2 text-ink",
        isUser && isFirst && "rounded-tr-md",
        !isUser && isFirst && "rounded-tl-md"
      )}
    >
      {isUser ? (
        <p className="whitespace-pre-wrap">{message.content}</p>
      ) : (
        <RichContent content={message.content} />
      )}
    </div>
  );
}
