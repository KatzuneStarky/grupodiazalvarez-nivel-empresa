import type { NextConfig } from "next";
import fs from "fs"

const versionFile = "./public/version.json"
const versionData = { version: new Date().toISOString() }

fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2))
console.log("✅ Versión actualizada:", versionData.version)

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
};

export default nextConfig;
