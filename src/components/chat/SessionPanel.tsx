"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConnectionStatus, DemoPersona, OrchestratorState } from "@/types/api";
import { describeStage } from "./FlowProgress";
import { PersonaPicker } from "./PersonaPicker";

interface SessionPanelProps {
  connection: ConnectionStatus;
  currentState: OrchestratorState;
  isAuthenticated: boolean;
  userName: string | null;
  sessionId: string | null;
  availableActions: string[];
  personas: DemoPersona[];
  signupEnabled: boolean;
  disabled: boolean;
  onSelect: (message: string) => void;
  onSelectPersona: (personaId: string) => void;
}

const SERVICES: { action: string; label: string; message: string }[] = [
  { action: "consultar_limite", label: "Consultar limite de crédito", message: "quero ver meu limite" },
  { action: "solicitar_aumento", label: "Solicitar aumento de limite", message: "quero aumentar meu limite" },
  { action: "cotacao_cambio", label: "Cotação de moedas", message: "cotação de moedas" },
  { action: "atualizar_perfil", label: "Atualizar perfil financeiro", message: "quero atualizar meu perfil" },
];

const CONNECTION_LABEL: Record<ConnectionStatus, string> = {
  connecting: "Conectando",
  online: "Online",
  offline: "Indisponível",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{children}</dd>
    </div>
  );
}

/** Painel lateral com o resumo do atendimento, como nos portais de internet banking. */
export function SessionPanel({
  connection,
  currentState,
  isAuthenticated,
  userName,
  sessionId,
  availableActions,
  personas,
  signupEnabled,
  disabled,
  onSelect,
  onSelectPersona,
}: SessionPanelProps) {
  const protocol = sessionId ? sessionId.replace(/-/g, "").slice(0, 8).toUpperCase() : "—";
  const servicesEnabled = isAuthenticated && !disabled && currentState !== "goodbye";

  return (
    <aside className="flex flex-col rounded border border-line bg-surface" aria-label="Resumo do atendimento">
      <section className="border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">Atendimento</h2>
        <dl className="mt-1 divide-y divide-line">
          <Row label="Status">
            <span className="inline-flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  connection === "online" ? "bg-success" : connection === "offline" ? "bg-danger" : "bg-accent"
                )}
                aria-hidden="true"
              />
              {CONNECTION_LABEL[connection]}
            </span>
          </Row>
          <Row label="Cliente">{isAuthenticated && userName ? userName : "Não identificado"}</Row>
          <Row label="Etapa">{describeStage(currentState)}</Row>
          <Row label="Protocolo">
            <span className="tabular-nums">{protocol}</span>
          </Row>
        </dl>
      </section>

      {!isAuthenticated && (personas.length > 0 || signupEnabled) && (
        <section className="border-b border-line px-4 py-3">
          <PersonaPicker
            personas={personas}
            signupEnabled={signupEnabled}
            disabled={disabled}
            onSelect={onSelectPersona}
            onCreateAccount={() => onSelect("criar conta")}
          />
        </section>
      )}

      <section className="border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">Serviços</h2>
        {!isAuthenticated && (
          <p className="mt-1 text-xs text-ink-muted">Disponíveis após a identificação do cliente.</p>
        )}
        <ul className="mt-1 -mx-2">
          {SERVICES.map((service) => {
            const listed = availableActions.includes(service.action);
            const enabled = servicesEnabled && listed;
            return (
              <li key={service.action}>
                <button
                  type="button"
                  disabled={!enabled}
                  onClick={() => onSelect(service.message)}
                  className="w-full rounded px-2 py-1.5 text-left text-sm text-ink transition-colors hover:bg-navy-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 disabled:cursor-default disabled:text-ink-muted/70 disabled:hover:bg-transparent"
                >
                  {service.label}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 py-3 text-xs leading-relaxed text-ink-muted">
        <p className="flex items-center gap-1.5 font-medium text-ink">
          <Lock size={12} aria-hidden="true" />
          Segurança
        </p>
        <p className="mt-1">
          O assistente nunca solicita senha, código do cartão ou token. Se algo parecer estranho,
          encerre o atendimento.
        </p>
      </section>
    </aside>
  );
}
