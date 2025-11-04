import React from 'react';
import Skeleton from '@/app/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}
