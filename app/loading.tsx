import React from 'react';
import Skeleton from './components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="glass-card p-6 rounded-2xl space-y-3">
        <Skeleton variant="title" className="w-1/3" />
        <Skeleton variant="text" className="w-2/3" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    </div>
  );
}
