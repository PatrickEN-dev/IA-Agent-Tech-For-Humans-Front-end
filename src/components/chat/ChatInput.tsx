"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Lock, Send } from "lucide-react";

type InputMode = "text" | "numeric" | "decimal";

// Abaixo do MAX_MESSAGE_LENGTH do back-end (2000), que responde com um pedido de resumo.
const MAX_MESSAGE_LENGTH = 1000;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  inputMode?: InputMode;
}

interface FormData {
  message: string;
}

export function ChatInput({ onSend, disabled, placeholder, inputMode = "text" }: ChatInputProps) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { message: "" },
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref: registerRef, ...field } = register("message");

  // Devolve o foco ao campo assim que a resposta chega, para a conversa fluir so no teclado.
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const onSubmit = (data: FormData) => {
    const message = data.message.trim();
    if (message && !disabled) {
      onSend(message);
      reset();
    }
  };

  return (
    <div className="px-4 pb-3 pt-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 rounded-full border border-line bg-surface-2 py-1.5 pl-4 pr-1.5 transition-shadow focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15"
      >
        <input
          {...field}
          ref={(element) => {
            registerRef(element);
            inputRef.current = element;
          }}
          type="text"
          placeholder={placeholder || "Digite sua mensagem..."}
          disabled={disabled}
          inputMode={inputMode}
          maxLength={MAX_MESSAGE_LENGTH}
          autoComplete="off"
          autoFocus
          aria-label="Mensagem"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/80 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white shadow-bubble transition-colors hover:bg-brand-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Enviar"
        >
          <Send size={16} />
        </button>
      </form>
      <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-ink-muted">
        <Lock size={11} aria-hidden="true" />
        Conversa segura · nunca pedimos senha ou dados do cartão
      </p>
    </div>
  );
}
