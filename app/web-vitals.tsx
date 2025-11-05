'use client';

/**
 * Web Vitals Tracking
 *
 * Tracks Core Web Vitals and sends to analytics.
 * Helps monitor real-user performance metrics.
 */

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Core Web Vitals
    const { name, value, rating, id } = metric;

    // Only track in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Web Vitals] ${name}:`, {
        value: Math.round(value),
        rating,
        id,
      });
      return;
    }

    // Send to analytics service
    // Option 1: Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        event_category: 'Web Vitals',
        event_label: id,
        non_interaction: true,
      });
    }

    // Option 2: Custom analytics endpoint
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, value, rating, id }),
    // }).catch(console.error);

    // Option 3: Sentry Performance Monitoring
    // if (typeof window !== 'undefined' && (window as any).Sentry) {
    //   (window as any).Sentry.captureMessage(`Web Vital: ${name}`, {
    //     level: rating === 'good' ? 'info' : 'warning',
    //     tags: { metric: name, rating },
    //     extra: { value, id },
    //   });
    // }
  });

  // Optional: Track route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Navigation] Route changed');
      }
    };

    // Track navigation timing
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation && process.env.NODE_ENV !== 'production') {
        console.log('[Performance] Navigation Timing:', {
          dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
          tcp: Math.round(navigation.connectEnd - navigation.connectStart),
          ttfb: Math.round(navigation.responseStart - navigation.requestStart),
          download: Math.round(navigation.responseEnd - navigation.responseStart),
          domInteractive: Math.round(navigation.domInteractive - navigation.fetchStart),
          domComplete: Math.round(navigation.domComplete - navigation.fetchStart),
        });
      }
    }
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Web Vitals Thresholds
 *
 * Good/Needs Improvement/Poor ratings:
 *
 * LCP (Largest Contentful Paint):
 * - Good: < 2.5s
 * - Needs Improvement: 2.5s - 4.0s
 * - Poor: > 4.0s
 *
 * FID (First Input Delay):
 * - Good: < 100ms
 * - Needs Improvement: 100ms - 300ms
 * - Poor: > 300ms
 *
 * CLS (Cumulative Layout Shift):
 * - Good: < 0.1
 * - Needs Improvement: 0.1 - 0.25
 * - Poor: > 0.25
 *
 * TTFB (Time to First Byte):
 * - Good: < 800ms
 * - Needs Improvement: 800ms - 1800ms
 * - Poor: > 1800ms
 *
 * FCP (First Contentful Paint):
 * - Good: < 1.8s
 * - Needs Improvement: 1.8s - 3.0s
 * - Poor: > 3.0s
 */
