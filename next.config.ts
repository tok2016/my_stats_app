import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: '/pnpm-lock.yaml'
  }
};

export default nextConfig;
