/** @type {import('next').NextConfig} */

/**
 * Cabeçalhos de segurança.
 *
 * Não há Content-Security-Policy aqui de propósito: o `next/font` injeta estilos inline,
 * e uma CSP escrita sem testar cada build vira ou um `unsafe-inline` que não protege
 * nada, ou uma página quebrada em produção. Os cabeçalhos abaixo são os que valem sem
 * contrapartida.
 */
const securityHeaders = [
  // A aplicação nunca é legitimamente exibida dentro de um iframe de terceiro.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nenhum recurso sensível do navegador é usado; negar tudo reduz a superfície.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig = {
  // Não anunciar a stack em todo response.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // O browser chama /api/* na propria origem e o Next repassa ao back-end: sem CORS.
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
