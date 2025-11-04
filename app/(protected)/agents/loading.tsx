import React from 'react';
import Skeleton from '@/app/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <Skeleton variant="avatar" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="title" className="w-2/3" />
              <Skeleton variant="text" className="w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
