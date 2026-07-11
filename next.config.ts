import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Permite acessar o dev server pelo IP da rede (ex.: celular na mesma Wi‑Fi).
  allowedDevOrigins: ["192.168.15.6"],
  async redirects() {
    return [
      {
        source: "/:locale(pt|en|es)/documentacao",
        destination: "/:locale/docs",
        permanent: false,
      },
    ];
  },
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.clonk.ai",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
