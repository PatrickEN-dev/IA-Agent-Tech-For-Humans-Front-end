import { z } from "zod";

export const employmentTypes = [
  { value: "CLT", label: "CLT (Formal)" },
  { value: "PUBLICO", label: "Servidor Publico" },
  { value: "AUTONOMO", label: "Autonomo" },
  { value: "MEI", label: "MEI (Microempreendedor)" },
  { value: "DESEMPREGADO", label: "Desempregado" },
] as const;

export const rendaSchema = z
  .string()
  .min(1, "Renda e obrigatoria")
  .transform((val) => parseFloat(val.replace(/\D/g, "")))
  .refine((val) => !isNaN(val) && val > 0, {
    message: "Digite um valor valido para a renda",
  });

export const despesasSchema = z
  .string()
  .min(1, "Despesas sao obrigatorias")
  .transform((val) => parseFloat(val.replace(/\D/g, "")))
  .refine((val) => !isNaN(val) && val >= 0, {
    message: "Digite um valor valido para as despesas",
  });

export const dependentesSchema = z
  .string()
  .min(1, "Numero de dependentes e obrigatorio")
  .transform((val) => parseInt(val.replace(/\D/g, ""), 10))
  .refine((val) => !isNaN(val) && val >= 0, {
    message: "Digite um numero valido",
  });

export const empregoSchema = z.enum([
  "CLT",
  "FORMAL",
  "PUBLICO",
  "AUTONOMO",
  "MEI",
  "DESEMPREGADO",
]);

export const interviewFormSchema = z.object({
  renda_mensal: z.number().positive("Renda deve ser positiva"),
  tipo_emprego: empregoSchema,
  despesas: z.number().nonnegative("Despesas nao podem ser negativas"),
  num_dependentes: z.number().int().nonnegative("Valor invalido"),
  tem_dividas: z.boolean(),
});

export type InterviewFormData = z.infer<typeof interviewFormSchema>;
