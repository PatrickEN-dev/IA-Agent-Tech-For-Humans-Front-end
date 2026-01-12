"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { apiService } from "@/services/api.service";
import toast from "react-hot-toast";

export function ApiTestButton() {
  const [isChecking, setIsChecking] = useState(false);

  const testConnection = async () => {
    setIsChecking(true);
    try {
      const result = await apiService.healthCheck();
      if (result && result.status === "healthy") {
        toast.success("Backend Online - Conexão estabelecida!");
      } else {
        toast.error("Backend Offline - Falha na conexão");
      }
    } catch {
      toast.error("Erro de Conexão - Não foi possível conectar ao backend");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Button
      onClick={testConnection}
      variant="ghost"
      size="sm"
      disabled={isChecking}
      className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
    >
      {isChecking ? "..." : "Status"}
    </Button>
  );
}
