'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function RouteTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const disabled = process.env.NEXT_PUBLIC_DISABLE_ROUTE_TRANSITIONS === 'true';

  if (disabled) return <>{children}</>;

  const duration = reducedMotion ? 0.01 : 0.2;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="gpu-accelerated"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0, transition: { duration, ease: 'easeOut' } }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -6, transition: { duration, ease: 'easeIn' } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
