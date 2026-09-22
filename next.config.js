/** @type {import('next').NextConfig} */

// Ensure NEXTAUTH_URL is never empty, which causes next-auth parseUrl to throw ERR_INVALID_URL
const siteUrl =
  process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.trim() !== ''
    ? process.env.NEXTAUTH_URL
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

process.env.NEXTAUTH_URL = siteUrl;

const nextConfig = {
  env: {
    NEXTAUTH_URL: siteUrl,
  },
  images: {
    domains: ['localhost', 'utfs.io'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
};

module.exports = nextConfig;

