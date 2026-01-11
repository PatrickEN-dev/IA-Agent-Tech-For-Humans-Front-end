"use client";

import { useState, useCallback } from "react";
import { apiService } from "@/services/api.service";
import { formatCurrency } from "@/lib/utils";
import {
  INTERVIEW_MESSAGES,
  EMPLOYMENT_INPUT_MAP,
  YES_ANSWERS,
  NO_ANSWERS,
} from "@/constants/interview";
import { EmploymentType, InterviewRequest } from "@/types/api";

type InterviewStep = "renda" | "emprego" | "despesas" | "dependentes" | "dividas" | "complete";

interface InterviewData {
  renda_mensal?: number;
  tipo_emprego?: EmploymentType;
  despesas?: number;
  num_dependentes?: number;
  tem_dividas?: boolean;
}

interface UseInterviewReturn {
  step: InterviewStep;
  data: InterviewData;
  processInput: (input: string) => Promise<string | null>;
  reset: () => void;
  isComplete: boolean;
}

export function useInterview(
  onComplete: (message: string) => void,
  onError: (message: string) => void
): UseInterviewReturn {
  const [step, setStep] = useState<InterviewStep>("renda");
  const [data, setData] = useState<InterviewData>({});

  const reset = useCallback(() => {
    setStep("renda");
    setData({});
  }, []);

  const processInput = useCallback(
    async (input: string): Promise<string | null> => {
      const lowerInput = input.toLowerCase().trim();

      switch (step) {
        case "renda": {
          const renda = parseFloat(input.replace(/\D/g, ""));
          if (isNaN(renda) || renda <= 0) {
            return INTERVIEW_MESSAGES.RENDA_INVALID;
          }
          setData((prev) => ({ ...prev, renda_mensal: renda }));
          setStep("emprego");
          return INTERVIEW_MESSAGES.RENDA(formatCurrency(renda));
        }

        case "emprego": {
          const tipoEmprego = EMPLOYMENT_INPUT_MAP[lowerInput];
          if (!tipoEmprego) {
            return INTERVIEW_MESSAGES.EMPREGO_INVALID;
          }
          setData((prev) => ({ ...prev, tipo_emprego: tipoEmprego }));
          setStep("despesas");
          return INTERVIEW_MESSAGES.EMPREGO;
        }

        case "despesas": {
          const despesas = parseFloat(input.replace(/\D/g, ""));
          if (isNaN(despesas) || despesas < 0) {
            return INTERVIEW_MESSAGES.DESPESAS_INVALID;
          }
          setData((prev) => ({ ...prev, despesas }));
          setStep("dependentes");
          return INTERVIEW_MESSAGES.DESPESAS(formatCurrency(despesas));
        }

        case "dependentes": {
          const dependentes = parseInt(input.replace(/\D/g, ""), 10);
          if (isNaN(dependentes) || dependentes < 0) {
            return INTERVIEW_MESSAGES.DEPENDENTES_INVALID;
          }
          setData((prev) => ({ ...prev, num_dependentes: dependentes }));
          setStep("dividas");
          return INTERVIEW_MESSAGES.DEPENDENTES(dependentes);
        }

        case "dividas": {
          const temDividas = YES_ANSWERS.includes(lowerInput);
          const naoTemDividas = NO_ANSWERS.includes(lowerInput);

          if (!temDividas && !naoTemDividas) {
            return INTERVIEW_MESSAGES.DIVIDAS_INVALID;
          }

          const finalData: InterviewRequest = {
            renda_mensal: data.renda_mensal!,
            tipo_emprego: data.tipo_emprego!,
            despesas: data.despesas!,
            num_dependentes: data.num_dependentes!,
            tem_dividas: temDividas,
          };

          try {
            const response = await apiService.submitInterview(finalData);

            if (!response) {
              onError(
                "Não foi possível processar a entrevista no momento. Tente novamente mais tarde."
              );
              reset();
              return null;
            }

            const scoreDiff = response.new_score - response.previous_score;
            const scoreChange = scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff.toString();

            const message = `Entrevista Concluida!

Score Anterior: ${response.previous_score}
Novo Score: ${response.new_score} (${scoreChange})

${response.recommendation}

Posso ajudar com mais alguma coisa?`;

            onComplete(message);
            reset();
            return null;
          } catch {
            onError("Erro ao processar entrevista. Tente novamente mais tarde.");
            reset();
            return null;
          }
        }

        default:
          return null;
      }
    },
    [step, data, onComplete, onError, reset]
  );

  return {
    step,
    data,
    processInput,
    reset,
    isComplete: step === "complete",
  };
}
