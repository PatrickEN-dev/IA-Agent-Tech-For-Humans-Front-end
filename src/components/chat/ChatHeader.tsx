"use client";

import { ClipboardList, Coins, CreditCard, LogOut, ShieldCheck, UserCheck, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/utils";
import type { AgentType, ConnectionStatus } from "@/types/api";

interface ChatHeaderProps {
  connection: ConnectionStatus;
  currentAgent: AgentType;
  isAuthenticated: boolean;
  userName: string | null;
  onLogout: () => void;
}

const AGENT_META: Record<AgentType, { label: string; icon: LucideIcon }> = {
  triage: { label: "Identificação", icon: UserCheck },
  credit: { label: "Crédito", icon: CreditCard },
  interview: { label: "Perfil financeiro", icon: ClipboardList },
  exchange: { label: "Câmbio", icon: Coins },
};

const CONNECTION_META: Record<ConnectionStatus, { label: string; dot: string }> = {
  connecting: { label: "Conectando…", dot: "bg-amber-400 animate-pulse" },
  online: { label: "Online", dot: "bg-accent" },
  offline: { label: "Indisponível", dot: "bg-danger" },
};

export function ChatHeader({
  connection,
  currentAgent,
  isAuthenticated,
  userName,
  onLogout,
}: ChatHeaderProps) {
  const agent = AGENT_META[currentAgent] ?? AGENT_META.triage;
  const AgentIcon = agent.icon;
  const status = CONNECTION_META[connection];

  return (
    <header className="flex items-center gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur">
      <BrandMark size={40} />

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight text-ink">Banco Ágil</h1>
        <p className="flex items-center gap-1.5 whitespace-nowrap text-xs text-ink-muted" role="status">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", status.dot)} aria-hidden="true" />
          <span>
            <span className="hidden sm:inline">Assistente virtual · </span>
            {status.label}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <span
            className="hidden items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-muted sm:inline-flex"
            title="Etapa atual do atendimento"
          >
            <AgentIcon size={13} aria-hidden="true" />
            {agent.label}
          </span>
        )}

        {isAuthenticated && (
          <span className="inline-flex max-w-[9rem] items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-ink">
            <ShieldCheck size={13} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{userName ? `Olá, ${userName}` : "Autenticado"}</span>
          </span>
        )}

        {isAuthenticated && (
          <Button variant="ghost" size="sm" onClick={onLogout} aria-label="Encerrar e sair">
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        )}
      </div>
    </header>
  );
}
