"use client";

import { Button } from "@/components/ui/Button";
import { useApi } from "@/hooks/useApi";
import { toast } from "@/hooks/useToast";

export function ApiTestButton() {
  const api = useApi();

  const testConnection = async () => {
    try {
      const result = await api.get("/health");
      if (result.success) {
        toast({
          title: "✅ Backend Online",
          description: "Conexão estabelecida com sucesso!",
          duration: 3000,
        });
      } else {
        toast({
          title: "❌ Backend Offline",
          description: result.error || "Falha na conexão com o backend",
          duration: 4000,
        });
      }
    } catch {
      toast({
        title: "❌ Erro de Conexão",
        description: "Não foi possível conectar ao backend",
        duration: 4000,
      });
    }
  };

  return (
    <Button
      onClick={testConnection}
      variant="ghost"
      size="sm"
      className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
    >
      • Status
    </Button>
  );
}
