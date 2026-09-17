/** @type {import('next').NextConfig} */
const nextConfig = {
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
