import { describe, expect, it } from "vitest";
import { describeApiDetail, formatBRL, maskCEP, maskCPF, maskDate } from "./utils";

describe("formatBRL", () => {
  it("usa o formato brasileiro, igual ao que o back-end escreve nas mensagens", () => {
    //   é o espaço fixo que o Intl insere depois de "R$".
    expect(formatBRL(15000)).toBe("R$ 15.000,00");
    expect(formatBRL(1000000)).toBe("R$ 1.000.000,00");
    expect(formatBRL(0)).toBe("R$ 0,00");
  });
});

describe("maskCPF", () => {
  it("aplica a pontuação progressivamente", () => {
    expect(maskCPF("529")).toBe("529");
    expect(maskCPF("529982")).toBe("529.982");
    expect(maskCPF("529982247")).toBe("529.982.247");
    expect(maskCPF("52998224725")).toBe("529.982.247-25");
  });

  it("descarta dígitos além dos 11 do CPF", () => {
    expect(maskCPF("52998224725999")).toBe("529.982.247-25");
  });

  it("é idempotente sobre um valor já mascarado", () => {
    expect(maskCPF("529.982.247-25")).toBe("529.982.247-25");
  });

  it("ignora o que não for dígito", () => {
    expect(maskCPF("abc529def982")).toBe("529.982");
  });
});

describe("maskDate", () => {
  it("aplica DD/MM/AAAA progressivamente", () => {
    expect(maskDate("15")).toBe("15");
    expect(maskDate("1505")).toBe("15/05");
    expect(maskDate("15051990")).toBe("15/05/1990");
  });

  it("é idempotente", () => {
    expect(maskDate("15/05/1990")).toBe("15/05/1990");
  });
});

describe("maskCEP", () => {
  it("aplica 00000-000", () => {
    expect(maskCEP("01310")).toBe("01310");
    expect(maskCEP("01310100")).toBe("01310-100");
    expect(maskCEP("01310-100")).toBe("01310-100");
  });
});

describe("describeApiDetail", () => {
  it("aceita detalhe em texto", () => {
    expect(describeApiDetail("CPF não encontrado")).toBe("CPF não encontrado");
  });

  it("aceita o objeto devolvido pela autenticação", () => {
    expect(describeApiDetail({ message: "Invalid CPF", remaining_attempts: 2 })).toBe(
      "Invalid CPF"
    );
  });

  it("aceita a lista de erros de validação do FastAPI", () => {
    expect(describeApiDetail([{ msg: "campo obrigatório", loc: ["body", "cpf"] }])).toContain(
      "campo obrigatório"
    );
  });

  it("devolve null quando não há detalhe", () => {
    expect(describeApiDetail(undefined)).toBeNull();
  });
});
