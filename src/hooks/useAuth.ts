"use client";

import { useState, useCallback } from "react";
import { apiService } from "@/services/api.service";
import { formatBirthdateForAPI } from "@/schemas/auth.schema";
import type { AuthResponse } from "@/types/api";

interface UseAuthReturn {
  isAuthenticated: boolean;
  remainingAttempts: number;
  error: string | null;
  cpf: string;
  setCpf: (cpf: string) => void;
  authenticate: (cpf: string, birthdate: string) => Promise<AuthResponse | null>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [cpf, setCpf] = useState("");

  const authenticate = useCallback(
    async (cpfValue: string, birthdate: string): Promise<AuthResponse | null> => {
      setError(null);

      const response = await apiService.authenticate({
        cpf: cpfValue.replace(/\D/g, ""),
        birthdate: formatBirthdateForAPI(birthdate),
      });

      if (response) {
        setRemainingAttempts(response.remaining_attempts);

        if (response.authenticated) {
          setIsAuthenticated(true);
        } else {
          setError("CPF ou data de nascimento incorretos");
        }
      } else {
        setError("Erro ao tentar autenticar. Verifique sua conexão.");
      }

      return response;
    },
    []
  );

  const logout = useCallback(() => {
    apiService.clearToken();
    setIsAuthenticated(false);
    setRemainingAttempts(3);
    setCpf("");
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAuthenticated,
    remainingAttempts,
    error,
    cpf,
    setCpf,
    authenticate,
    logout,
    clearError,
  };
}
