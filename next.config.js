/** @type {import('next').NextConfig} */

// Clean up NEXTAUTH_URL if it's set to an empty string (prevents next-auth parseUrl ERR_INVALID_URL)
if (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.trim() === '') {
  delete process.env.NEXTAUTH_URL;
}

// Fallback secret for production builds and environments where NEXTAUTH_SECRET is omitted
if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.trim() === '') {
  process.env.NEXTAUTH_SECRET = 'vidyalaya-sms-super-secret-jwt-token-key-2026-prod';
}

const nextConfig = {
  images: {
    domains: ['localhost', 'utfs.io'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
};

module.exports = nextConfig;

