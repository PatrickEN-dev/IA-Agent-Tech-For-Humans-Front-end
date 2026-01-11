"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApiTestButton } from "./ApiTestButton";

interface ChatHeaderProps {
  showLogout: boolean;
  onLogout: () => void;
}

export function ChatHeader({ showLogout, onLogout }: ChatHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Banco Agil</h1>
          <p className="text-sm text-blue-100">Assistente Virtual</p>
        </div>
        <div className="flex items-center gap-2">
          <ApiTestButton />
          {showLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white hover:bg-blue-500"
            >
              <LogOut size={16} />
              Sair
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
