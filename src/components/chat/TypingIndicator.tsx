"use client";

import { Loader2 } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
        <Loader2 size={18} className="text-white animate-spin" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <span className="text-gray-500 text-sm">Digitando...</span>
      </div>
    </div>
  );
}
