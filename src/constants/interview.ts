import { EmploymentType } from "@/types/api";

export const EMPLOYMENT_OPTIONS: Array<{
  value: EmploymentType;
  label: string;
  key: string;
}> = [
  { value: "CLT", label: "CLT (Formal)", key: "1" },
  { value: "PUBLICO", label: "Servidor Publico", key: "2" },
  { value: "AUTONOMO", label: "Autonomo", key: "3" },
  { value: "MEI", label: "MEI (Microempreendedor)", key: "4" },
  { value: "DESEMPREGADO", label: "Desempregado", key: "5" },
];

export const EMPLOYMENT_INPUT_MAP: Record<string, EmploymentType> = {
  "1": "CLT",
  clt: "CLT",
  formal: "FORMAL",
  "2": "PUBLICO",
  publico: "PUBLICO",
  servidor: "PUBLICO",
  "3": "AUTONOMO",
  autonomo: "AUTONOMO",
  "4": "MEI",
  mei: "MEI",
  microempreendedor: "MEI",
  "5": "DESEMPREGADO",
  desempregado: "DESEMPREGADO",
};

export const INTERVIEW_MESSAGES = {
  RENDA: (value: string) => `Renda registrada: ${value}

Qual e o seu tipo de emprego?

1 - CLT (Formal)
2 - Servidor Publico
3 - Autonomo
4 - MEI (Microempreendedor)
5 - Desempregado

Digite o numero correspondente:`,

  EMPREGO: `Tipo de emprego registrado!

Qual e o valor total das suas despesas mensais? (exemplo: 3000):`,

  DESPESAS: (value: string) => `Despesas registradas: ${value}

Quantos dependentes voce possui? (exemplo: 2):`,

  DEPENDENTES: (count: number) => `${count} dependente(s) registrado(s)!

Voce possui dividas em aberto? (sim/nao):`,

  PROCESSING: "Processando sua entrevista financeira...",

  RENDA_INVALID: "Por favor, digite um valor valido para sua renda mensal (exemplo: 5000):",
  EMPREGO_INVALID: "Opcao invalida. Por favor, digite um numero de 1 a 5:",
  DESPESAS_INVALID: "Por favor, digite um valor valido para suas despesas (exemplo: 3000):",
  DEPENDENTES_INVALID: "Por favor, digite um numero valido de dependentes:",
  DIVIDAS_INVALID: 'Por favor, responda "sim" ou "nao":',
} as const;

export const YES_ANSWERS = ["sim", "s", "yes", "y", "1", "true"];
export const NO_ANSWERS = ["nao", "n", "no", "0", "false"];
