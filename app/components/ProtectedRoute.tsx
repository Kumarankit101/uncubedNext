import React from 'react';
import { useAuth } from '@clerk/nextjs';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-current border-t-transparent animate-spin" aria-label="Loading" />
      </div>
    );
  }
  // Protection is handled by middleware, just render children
  return <>{children}</>;
}

export default ProtectedRoute; 