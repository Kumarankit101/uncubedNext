'use client';

import React from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export default function NetworkIndicator() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const active = (fetching ?? 0) + (mutating ?? 0) > 0;

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="ml-2 inline-block align-middle w-2 h-2 rounded-full bg-accent-blue animate-pulse"
      title="Background activity"
    />
  );
}
