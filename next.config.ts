import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: '/pnpm-lock.yaml'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com'
      }
    ]
  }
};

export default nextConfig;
