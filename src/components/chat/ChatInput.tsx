"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type InputMode = "text" | "numeric" | "decimal";

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
    if (data.message.trim() && !disabled) {
      onSend(data.message.trim());
      reset();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
        <Input
          {...field}
          ref={(element) => {
            registerRef(element);
            inputRef.current = element;
          }}
          placeholder={placeholder || "Digite sua mensagem..."}
          disabled={disabled}
          inputMode={inputMode}
          autoComplete="off"
          autoFocus
          aria-label="Mensagem"
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled}
          className="w-12 h-12 flex-shrink-0"
          aria-label="Enviar"
        >
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
}
