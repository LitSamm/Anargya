import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["duckdb"],
  images: {
    domains: ["images.unsplash.com", "anargyaits.com"],
  },
};

export default nextConfig;
