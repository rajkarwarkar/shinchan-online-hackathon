import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Server-side packages allowlist
  serverExternalPackages: ['@mozilla/readability', 'jsdom']
};

export default nextConfig;

