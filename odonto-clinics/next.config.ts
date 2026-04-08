import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images : {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
