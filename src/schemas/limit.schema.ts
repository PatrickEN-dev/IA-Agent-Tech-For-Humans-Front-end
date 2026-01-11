import { z } from "zod";

export const limitRequestSchema = z
  .string()
  .min(1, "Valor e obrigatorio")
  .transform((val) => parseFloat(val.replace(/\D/g, "")))
  .refine((val) => !isNaN(val) && val > 0, {
    message: "Digite um valor valido",
  });

export const limitFormSchema = z.object({
  new_limit: z.number().positive("O limite deve ser maior que zero"),
});

export type LimitFormData = z.infer<typeof limitFormSchema>;
