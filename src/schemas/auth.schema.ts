import { z } from "zod";

export const cpfSchema = z
  .string()
  .min(1, "CPF e obrigatorio")
  .transform((val) => val.replace(/\D/g, ""))
  .refine((val) => val.length === 11, {
    message: "CPF deve ter 11 digitos",
  });

export const birthdateSchema = z
  .string()
  .min(1, "Data de nascimento e obrigatoria")
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA")
  .refine(
    (date) => {
      const [day, month, year] = date.split("/").map(Number);
      const dateObj = new Date(year, month - 1, day);
      return (
        dateObj.getDate() === day &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getFullYear() === year &&
        dateObj < new Date()
      );
    },
    { message: "Data invalida" }
  );

export const authFormSchema = z.object({
  cpf: cpfSchema,
  birthdate: birthdateSchema,
});

export type AuthFormData = z.infer<typeof authFormSchema>;

export function formatBirthdateForAPI(date: string): string {
  const [day, month, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
