import { describe, expect, it } from "vitest";
import { getQuickReplies } from "./QuickReplies";
import type { DemoPersona } from "@/types/api";

const PERSONAS: DemoPersona[] = [
  {
    id: "52998224725",
    nome: "Maria Helena Santos",
    primeiro_nome: "Maria",
    cpf: "52998224725",
    cpf_formatado: "529.982.247-25",
    data_nascimento: "1990-05-15",
    score: 315,
    limite_atual: 500,
    max_limit_for_score: 1000,
    perfil: "Score 315",
  },
  {
    id: "44363185910",
    nome: "Patricia Souza Nascimento",
    primeiro_nome: "Patricia",
    cpf: "44363185910",
    cpf_formatado: "443.631.859-10",
    data_nascimento: "1976-06-14",
    score: 920,
    limite_atual: 50000,
    max_limit_for_score: 50000,
    perfil: "Score 920",
  },
];

describe("getQuickReplies na identificação", () => {
  it("oferece uma persona por chip, com o score visível", () => {
    const replies = getQuickReplies("collecting_cpf", false, [], false, null, PERSONAS, true);

    expect(replies.map((r) => r.label)).toEqual([
      "Entrar como Maria (315)",
      "Entrar como Patricia (920)",
      "Criar conta de teste",
    ]);
  });

  it("marca os chips de persona com personaId, para virarem login e não mensagem", () => {
    const replies = getQuickReplies("collecting_cpf", false, [], false, null, PERSONAS, true);
    expect(replies[0].personaId).toBe("52998224725");
    expect(replies[2].personaId).toBeUndefined();
  });

  it("omite o cadastro quando o back-end o desliga", () => {
    const replies = getQuickReplies("collecting_cpf", false, [], false, null, PERSONAS, false);
    expect(replies.map((r) => r.label)).not.toContain("Criar conta de teste");
  });

  it("não mostra nada quando a demonstração está desligada", () => {
    // Sem modo demo o chat volta a ser exatamente o que era: só o campo de CPF.
    expect(getQuickReplies("collecting_cpf", false, [], false, null, [], false)).toEqual([]);
  });
});

describe("getQuickReplies no cadastro", () => {
  it("oferece o atalho de gerar CPF, que o visitante não adivinharia", () => {
    const replies = getQuickReplies("signup_cpf", false, [], false, null);
    expect(replies.map((r) => r.message)).toEqual(["gera um pra mim", "cancelar"]);
  });

  it("permite pular o CEP", () => {
    const replies = getQuickReplies("signup_cep", false, [], false, null);
    expect(replies.map((r) => r.message)).toEqual(["pular", "cancelar"]);
  });

  it("sempre oferece saída durante o cadastro", () => {
    for (const state of ["signup_name", "signup_birthdate", "signup_cpf", "signup_cep"] as const) {
      const replies = getQuickReplies(state, false, [], false, null);
      expect(replies.some((r) => r.message === "cancelar")).toBe(true);
    }
  });
});

describe("getQuickReplies autenticado", () => {
  it("lista o menu a partir das ações que o back-end declarou", () => {
    const replies = getQuickReplies(
      "authenticated",
      true,
      ["consultar_limite", "cotacao_cambio"],
      false,
      null
    );
    expect(replies.map((r) => r.label)).toEqual(["Consultar limite", "Cotação de moedas"]);
  });

  it("antepõe sim/não quando há uma oferta pendente", () => {
    const replies = getQuickReplies(
      "authenticated",
      true,
      ["consultar_limite"],
      true,
      "Deseja solicitar aumento de limite?"
    );
    expect(replies[0].message).toBe("sim");
    expect(replies[1].message).toBe("não");
  });

  it("não oferece menu para quem ainda não se identificou", () => {
    expect(getQuickReplies("authenticated", false, ["consultar_limite"], false, null)).toEqual([]);
  });

  it("inclui cancelar apenas dentro de um fluxo aberto", () => {
    const dentro = getQuickReplies("interview_debts", true, ["cancelar"], false, null);
    expect(dentro.some((r) => r.message === "cancelar")).toBe(true);

    const fora = getQuickReplies("interview_debts", true, [], false, null);
    expect(fora.some((r) => r.message === "cancelar")).toBe(false);
  });
});
