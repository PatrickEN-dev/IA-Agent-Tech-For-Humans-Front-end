import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// Tipografia escolhida de propósito: Plex tem números tabulares e tom institucional.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Banco Ágil - Assistente Virtual",
  description: "Atendimento digital do Banco Ágil: limite de crédito, câmbio e perfil financeiro.",
};

export const viewport: Viewport = {
  themeColor: "#0f2a4a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={plexSans.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
