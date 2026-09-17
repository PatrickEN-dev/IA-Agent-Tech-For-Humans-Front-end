"use client";

import type { OrchestratorState } from "@/types/api";

export interface FlowStep {
  flow: string;
  step: string;
  index: number;
  total: number;
}

// Etapas dos fluxos de coleta do back-end, para o cliente saber onde está e quanto falta.
const FLOW_STEPS: Partial<Record<OrchestratorState, FlowStep>> = {
  collecting_cpf: { flow: "Identificação", step: "CPF", index: 1, total: 2 },
  collecting_birthdate: { flow: "Identificação", step: "Data de nascimento", index: 2, total: 2 },
  credit_increase_flow: { flow: "Aumento de limite", step: "Valor desejado", index: 1, total: 1 },
  interview_flow: { flow: "Perfil financeiro", step: "Renda mensal", index: 1, total: 5 },
  interview_income: { flow: "Perfil financeiro", step: "Renda mensal", index: 1, total: 5 },
  interview_employment: { flow: "Perfil financeiro", step: "Tipo de trabalho", index: 2, total: 5 },
  interview_expenses: { flow: "Perfil financeiro", step: "Despesas mensais", index: 3, total: 5 },
  interview_dependents: { flow: "Perfil financeiro", step: "Dependentes", index: 4, total: 5 },
  interview_debts: { flow: "Perfil financeiro", step: "Dívidas", index: 5, total: 5 },
  exchange_flow: { flow: "Câmbio", step: "Moeda de origem", index: 1, total: 2 },
  exchange_from: { flow: "Câmbio", step: "Moeda de origem", index: 1, total: 2 },
  exchange_to: { flow: "Câmbio", step: "Moeda de destino", index: 2, total: 2 },
};

export function getFlowStep(state: OrchestratorState): FlowStep | null {
  return FLOW_STEPS[state] ?? null;
}

/** Texto curto da etapa atual, para o painel lateral. */
export function describeStage(state: OrchestratorState): string {
  const step = getFlowStep(state);
  if (step) return `${step.flow} · ${step.step}`;
  if (state === "authenticated") return "Menu de serviços";
  if (state === "goodbye") return "Encerrado";
  return "Início";
}

export function FlowProgress({ state, className }: { state: OrchestratorState; className?: string }) {
  const step = getFlowStep(state);
  if (!step) return null;

  const percent = Math.round((step.index / step.total) * 100);

  return (
    <div className={className} aria-label={`${step.flow}: ${step.step}, etapa ${step.index} de ${step.total}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-ink">{step.flow}</span>
        <span className="tabular-nums text-ink-muted">
          {step.step} · {step.index} de {step.total}
        </span>
      </div>
      <div
        className="mt-1.5 h-1 overflow-hidden bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={step.total}
        aria-valuenow={step.index}
      >
        <div className="h-full bg-navy transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
