"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { maskCEP, maskCPF, maskDate } from "@/lib/utils";
import type { OrchestratorState } from "@/types/api";

type InputMode = "text" | "numeric" | "decimal";

// Abaixo do MAX_MESSAGE_LENGTH do back-end (2000), que responde com um pedido de resumo.
const MAX_MESSAGE_LENGTH = 1000;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  inputMode?: InputMode;
  /** Estado da conversa: define qual máscara aplicar enquanto o cliente digita. */
  currentState?: OrchestratorState;
  /** Aviso fixo abaixo do campo (ex.: dados fictícios no ambiente de demonstração). */
  notice?: string | null;
}

interface FormData {
  message: string;
}

/**
 * Máscara por estado da conversa.
 *
 * Só nos estados em que o back-end espera exatamente aquele formato. Em qualquer outro,
 * mascarar atrapalharia: "10 mil" e "cancelar" não são CPF. A máscara é conveniência
 * visual — o back-end remove a pontuação de qualquer jeito.
 */
function maskFor(state: OrchestratorState | undefined): ((value: string) => string) | null {
  switch (state) {
    case "collecting_cpf":
    case "signup_cpf":
      return maskCPF;
    case "collecting_birthdate":
    case "signup_birthdate":
      return maskDate;
    case "signup_cep":
      return maskCEP;
    default:
      return null;
  }
}

// Só mascaramos enquanto a entrada é numérica. Nesses mesmos estados o cliente pode
// responder "criar conta" ou "gera um pra mim", e essas frases precisam passar intactas.
const NUMERIC_ONLY = /^[\d.\-/\s]*$/;

export function ChatInput({
  onSend,
  disabled,
  placeholder,
  inputMode = "text",
  currentState,
  notice,
}: ChatInputProps) {
  const { register, handleSubmit, reset, setValue } = useForm<FormData>({
    defaultValues: { message: "" },
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref: registerRef, onChange: registerOnChange, ...field } = register("message");

  // Devolve o foco ao campo assim que a resposta chega, para a conversa fluir so no teclado.
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const mask = maskFor(currentState);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await registerOnChange(event);

    if (!mask) return;
    const raw = event.target.value;
    if (!NUMERIC_ONLY.test(raw)) return;

    const masked = mask(raw);
    if (masked !== raw) {
      setValue("message", masked, { shouldDirty: true });
    }
  };

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
          onChange={handleChange}
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
      {notice && (
        <p className="mt-2 rounded border border-accent/40 bg-accent/5 px-2.5 py-1.5 text-xs leading-relaxed text-ink-muted">
          {notice}
        </p>
      )}
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
