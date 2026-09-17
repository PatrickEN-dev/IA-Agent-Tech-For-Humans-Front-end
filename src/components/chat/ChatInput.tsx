"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <div className="px-4 pb-3 pt-3 md:px-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <input
          {...field}
          ref={(element) => {
            registerRef(element);
            inputRef.current = element;
          }}
          type="text"
          placeholder={placeholder || "Escreva sua mensagem"}
          disabled={disabled}
          inputMode={inputMode}
          maxLength={MAX_MESSAGE_LENGTH}
          autoComplete="off"
          autoFocus
          aria-label="Mensagem"
          className="h-10 min-w-0 flex-1 rounded border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/80 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20 disabled:cursor-not-allowed disabled:bg-surface-muted"
        />
        <Button type="submit" disabled={disabled}>
          Enviar
        </Button>
      </form>
      <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
        <span className="hidden sm:inline">Enter para enviar</span>
        <span className="inline-flex items-center gap-1">
          <Lock size={11} aria-hidden="true" />
          Conexão segura
        </span>
      </div>
    </div>
  );
}
