import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // Output mode - server for dynamic pages
  // This prevents static export which is causing error page prerendering issues
  output: undefined,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uncubed.me',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: false,
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/diy/:path*',
        destination: 'https://diy-dng7d9dbftdvahb8.eastus-01.azurewebsites.net/diy/:path*',
        permanent: false,
      },
    ];
  },
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const connectSrc = isDevelopment
      ? "'self' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.uncubed.me https://*.clerk-telemetry.com https://clerk-telemetry.com https://*.supabase.com https://*.azurewebsites.net http://localhost:3001"
      : "'self' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.uncubed.me https://*.clerk-telemetry.com https://clerk-telemetry.com https://*.supabase.com https://*.azurewebsites.net http://localhost:3001";

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

const withAnalyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

export default withAnalyzer(nextConfig);
