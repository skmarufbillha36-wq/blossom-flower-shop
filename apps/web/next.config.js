/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Required for Docker standalone output
  output: 'standalone',
  // Tell Next.js the monorepo root so it includes hoisted node_modules in standalone
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  // Allows importing from shared packages
  transpilePackages: ['@flower-shop/types'],
};

module.exports = nextConfig;
