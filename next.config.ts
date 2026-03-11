import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  
  // External packages for server-side rendering (Next.js 16+)
  serverExternalPackages: ['@xenova/transformers', 'sharp', 'onnxruntime-node'],
};

export default nextConfig;
