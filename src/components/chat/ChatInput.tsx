"use client";

import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

interface FormData {
  message: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { message: "" },
  });

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
          {...register("message")}
          placeholder={placeholder || "Digite sua mensagem..."}
          disabled={disabled}
          autoComplete="off"
        />
        <Button type="submit" size="icon" disabled={disabled} className="w-12 h-12">
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
}
