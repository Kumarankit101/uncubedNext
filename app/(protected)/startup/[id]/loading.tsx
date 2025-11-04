import React from 'react';
import Skeleton from '@/app/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-3">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
      <div className="lg:col-span-3 space-y-4">
        <Skeleton variant="title" className="w-1/3" />
        <Skeleton variant="text" className="w-2/3" />
        <Skeleton variant="card" className="h-40" />
      </div>
    </div>
  );
}
