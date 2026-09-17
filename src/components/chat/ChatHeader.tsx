"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";
import type { ConnectionStatus } from "@/types/api";

interface ChatHeaderProps {
  connection: ConnectionStatus;
  isAuthenticated: boolean;
  userName: string | null;
  onLogout: () => void;
}

const CONNECTION_META: Record<ConnectionStatus, { label: string; dot: string }> = {
  connecting: { label: "Conectando", dot: "bg-accent animate-pulse" },
  online: { label: "Online", dot: "bg-success" },
  offline: { label: "Indisponível", dot: "bg-danger" },
};

/** Barra de aplicação institucional: marca, status do canal e sessão do cliente. */
export function ChatHeader({ connection, isAuthenticated, userName, onLogout }: ChatHeaderProps) {
  const status = CONNECTION_META[connection];

  return (
    <header className="border-b-2 border-accent bg-navy text-white">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
        <Wordmark tone="light" />
        <span className="hidden h-5 w-px bg-white/25 sm:block" aria-hidden="true" />
        <span className="hidden text-sm text-white/80 sm:block">Assistente virtual</span>

        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-2 text-white/85" role="status">
            <span className={cn("h-2 w-2 rounded-full", status.dot)} aria-hidden="true" />
            {status.label}
          </span>

          {isAuthenticated && userName && (
            <span className="hidden items-center gap-2 border-l border-white/25 pl-4 sm:inline-flex">
              <span className="text-white/70">Cliente</span>
              <span className="font-medium">{userName}</span>
            </span>
          )}

          {isAuthenticated && (
            <Button variant="inverse" size="sm" onClick={onLogout} aria-label="Encerrar atendimento">
              <LogOut size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Encerrar atendimento</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
