import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acessar o dev server pelo IP da rede (ex.: celular na mesma Wi‑Fi).
  allowedDevOrigins: ["192.168.15.6"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.clonk.ai",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
