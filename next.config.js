/** @type {import('next').NextConfig} */

// Ensure NEXTAUTH_URL is never empty, which causes next-auth parseUrl to throw ERR_INVALID_URL
const siteUrl =
  process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.trim() !== ''
    ? process.env.NEXTAUTH_URL
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

const authSecret =
  process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim() !== ''
    ? process.env.NEXTAUTH_SECRET
    : 'vidyalaya-sms-super-secret-jwt-token-key-2026-prod';

process.env.NEXTAUTH_URL = siteUrl;
process.env.NEXTAUTH_SECRET = authSecret;

const nextConfig = {
  env: {
    NEXTAUTH_URL: siteUrl,
    NEXTAUTH_SECRET: authSecret,
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

