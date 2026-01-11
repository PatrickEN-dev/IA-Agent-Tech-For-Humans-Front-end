"use client";

import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as ShadcnToaster } from "@/components/ui/Toaster";

export function ToastProvider() {
  return (
    <>
      <HotToaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      <ShadcnToaster />
    </>
  );
}
