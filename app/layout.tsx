import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { RootProviders } from "./root-providers";

// Temporarily using system fonts until Phase 7 font optimization
// const inter = Inter({
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  metadataBase: new URL('https://uncubed.me'),
  title: {
    default: 'Uncubed - AI-powered startup co-pilot',
    template: '%s | Uncubed',
  },
  description: 'Transform your startup ideas into reality with AI-powered analysis, market research, and strategic guidance.',
  keywords: ['startup', 'AI', 'co-pilot', 'market research', 'business planning'],
  authors: [{ name: 'Uncubed Team' }],
  creator: 'Uncubed',
  publisher: 'Uncubed',
  openGraph: {
    title: 'Uncubed - AI-powered startup co-pilot',
    description: 'Transform your startup ideas into reality with AI-powered analysis, market research, and strategic guidance.',
    url: 'https://uncubed.me',
    siteName: 'Uncubed',
    images: [
      {
        url: 'https://uncubed.me/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Uncubed - AI-powered startup co-pilot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uncubed - AI-powered startup co-pilot',
    description: 'Transform your startup ideas into reality with AI-powered analysis, market research, and strategic guidance.',
    images: ['https://uncubed.me/og-image.jpg'],
    creator: '@uncubed',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://uncubed.me',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Rendering Strategy Documentation:
// - Public routes: SSR/ISR/SSG for SEO-critical pages (/, /privacy, /terms, /shared/result/[type]/[id])
// - Protected routes: CSR for interactivity (client components with React Query)
// - Temporarily using force-dynamic to fix build issue, will optimize per-route in Phase 2
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
      >
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
