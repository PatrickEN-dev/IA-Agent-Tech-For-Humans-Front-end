"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { ApiStatus } from "@/types/chat";

interface ApiStatusScreenProps {
  status: ApiStatus;
  onRetry: () => void;
}

export function ApiStatusScreen({ status, onRetry }: ApiStatusScreenProps) {
  if (status === "checking") {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-600">Conectando ao servidor...</p>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-red-600">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Servidor Indisponivel</h2>
          <p className="text-gray-600 mb-6">
            Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.
          </p>
          <Button onClick={onRetry} className="mx-auto">
            <RefreshCw size={18} />
            Tentar Novamente
          </Button>
        </Card>
      </div>
    );
  }

  return null;
}
