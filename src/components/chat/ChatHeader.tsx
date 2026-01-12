"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApiTestButton } from "./ApiTestButton";
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
          <h1 className="text-xl font-bold">Banco Agil</h1>
          <p className="text-sm text-blue-100">
            Agente: {getAgentLabel(currentAgent)}
            {isAuthenticated && " | Autenticado"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ApiTestButton />
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
