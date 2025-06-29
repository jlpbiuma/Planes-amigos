import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration for Netlify
  trailingSlash: true,
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
