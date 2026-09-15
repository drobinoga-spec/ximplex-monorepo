import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "../../",
  },
  experimental: {
    cacheComponents: false,
  },
};

export default nextConfig;