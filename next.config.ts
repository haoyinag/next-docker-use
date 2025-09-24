import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 按需开启实验特性
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
