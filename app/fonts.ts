/**
 * Font Configuration with Self-Hosted Fonts
 *
 * Using next/font/local instead of Google Fonts for:
 * - Better performance (no external request)
 * - Reliability (no network dependency)
 * - Privacy (no Google tracking)
 * - Faster LCP and FCP
 */

import localFont from 'next/font/local';

// Inter font family - self-hosted
// Download from: https://github.com/rsms/inter/releases
// Place in: public/fonts/inter/
export const inter = localFont({
  src: [
    {
      path: '../public/fonts/inter/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap', // FOUT instead of FOIT for better perceived performance
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
  adjustFontFallback: true, // Minimize layout shift
});

/**
 * Font configuration for performance
 *
 * Performance benefits:
 * - display: 'swap' - Show text immediately with fallback
 * - preload: true - High priority loading
 * - woff2 format - Best compression (~30% smaller than woff)
 * - adjustFontFallback - Reduces CLS
 */
