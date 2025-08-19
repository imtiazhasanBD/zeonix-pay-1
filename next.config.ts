import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
