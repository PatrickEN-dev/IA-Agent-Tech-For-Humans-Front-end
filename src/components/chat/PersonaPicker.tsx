"use client";

import { UserRound, UserPlus } from "lucide-react";
import type { DemoPersona } from "@/types/api";
import { formatBRL } from "@/lib/utils";

interface PersonaPickerProps {
  personas: DemoPersona[];
  signupEnabled: boolean;
  disabled?: boolean;
  onSelect: (personaId: string) => void;
  onCreateAccount: () => void;
}

/**
 * Seletor de clientes de demonstração.
 *
 * Existe porque o app pede um CPF que o visitante não tem como conhecer. Sem isto, quem
 * abre a demo digita o próprio CPF, recebe "não encontrado" três vezes e vai embora.
 * Cada persona mostra score e limite justamente para o visitante escolher o cenário
 * que quer ver: quem tem aumento negado, quem cai em análise manual, quem é aprovado.
 */
export function PersonaPicker({
  personas,
  signupEnabled,
  disabled,
  onSelect,
  onCreateAccount,
}: PersonaPickerProps) {
  if (personas.length === 0 && !signupEnabled) return null;

  return (
    <section aria-label="Entrar na demonstração">
      <h2 className="text-sm font-semibold text-ink">Entrar em um clique</h2>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        Clientes fictícios prontos para testar. Escolha um perfil ou crie a sua conta de teste.
      </p>

      <ul className="mt-2 space-y-1.5">
        {personas.map((persona) => (
          <li key={persona.id}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(persona.id)}
              className="w-full rounded border border-line bg-surface px-3 py-2 text-left transition-colors hover:border-navy hover:bg-navy-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <UserRound size={13} aria-hidden="true" />
                {persona.nome}
              </span>
              <span className="mt-0.5 block text-xs tabular-nums text-ink-muted">
                Score {persona.score} · limite {formatBRL(persona.limite_atual)} · teto{" "}
                {formatBRL(persona.max_limit_for_score)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {signupEnabled && (
        <button
          type="button"
          disabled={disabled}
          onClick={onCreateAccount}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded border border-dashed border-line-strong px-3 py-2 text-sm font-medium text-navy transition-colors hover:border-navy hover:bg-navy-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserPlus size={13} aria-hidden="true" />
          Criar minha conta de teste
        </button>
      )}
    </section>
  );
}
