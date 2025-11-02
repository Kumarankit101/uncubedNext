import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static generation completely to handle dynamic Clerk/React Query requirements
  // output: 'stan/dalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
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
  // Temporarily disabled headers due to Next.js 16 compatibility issue
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Cross-Origin-Embedder-Policy',
  //           value: 'require-corp',
  //         },
  //         {
  //           key: 'Cross-Origin-Opener-Policy',
  //           value: 'same-origin',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
