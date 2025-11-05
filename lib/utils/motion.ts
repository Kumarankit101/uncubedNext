/**
 * Conditional Motion Loading
 *
 * Provides lightweight alternatives to framer-motion for simple animations.
 * Only loads framer-motion when complex animations are needed.
 */

import { ComponentType } from 'react';

type MotionComponent = any;

// Cache for dynamically loaded motion components
let motionCache: typeof import('framer-motion') | null = null;

/**
 * Dynamically load framer-motion only when needed
 * Useful for code-splitting heavy animation library
 */
export async function loadMotion() {
  if (motionCache) {
    return motionCache;
  }

  motionCache = await import('framer-motion');
  return motionCache;
}

/**
 * Check if animations should be enabled based on user preferences
 */
export function shouldEnableAnimations(): boolean {
  if (typeof window === 'undefined') return true;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return !mediaQuery.matches;
}

/**
 * Simple CSS-based fade in animation (no framer-motion needed)
 */
export const simpleFadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

/**
 * Simple CSS-based scale animation (no framer-motion needed)
 */
export const simpleScale = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { duration: 0.2 }
};
