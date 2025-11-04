import React from 'react';
import Skeleton from '@/app/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton variant="title" className="w-1/2" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    </div>
  );
}
