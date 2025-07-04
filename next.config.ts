import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ]
  },
  allowedDevOrigins: [
    "http://admin.localtest.me:3000",
    "http://cbs.localtest.me:3000",
    "http://empleados.localtest.me:3000",
  ],
};

export default nextConfig;
