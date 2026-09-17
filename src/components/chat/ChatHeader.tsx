"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { OrchestratorState, AgentType } from "@/types/api";

interface ChatHeaderProps {
  showLogout: boolean;
  onLogout: () => void;
  currentAgent: AgentType;
  currentState: OrchestratorState;
  isAuthenticated: boolean;
}

function getAgentLabel(agent: AgentType): string {
  const labels: Record<AgentType, string> = {
    triage: "Triagem",
    credit: "Crédito",
    interview: "Entrevista",
    exchange: "Câmbio",
  };
  return labels[agent] || agent;
}

export function ChatHeader({
  showLogout,
  onLogout,
  currentAgent,
  isAuthenticated,
}: ChatHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Banco Ágil</h1>
          <p className="text-sm text-blue-100 flex items-center gap-2">
            <span>Agente: {getAgentLabel(currentAgent)}</span>
            {isAuthenticated && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-300" aria-hidden="true" />
                Autenticado
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white hover:bg-blue-500"
            >
              <LogOut size={16} />
              Sair
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
