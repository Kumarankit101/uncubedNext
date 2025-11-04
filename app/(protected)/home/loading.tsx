import React from 'react';
import Skeleton from '@/app/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-3">
        <Skeleton variant="title" className="w-1/3" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
      <div className="glass-card p-6 rounded-2xl space-y-3">
        <Skeleton variant="text" className="w-full h-20" />
        <div className="flex gap-3">
          <Skeleton variant="chip" className="w-24" />
          <Skeleton variant="chip" className="w-20" />
          <Skeleton variant="chip" className="w-28" />
        </div>
      </div>
    </div>
  );
}
