import React from 'react';
import { useAuth } from '@clerk/nextjs';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  // Protection is handled by middleware, just render children
  return <>{children}</>;
}

export default ProtectedRoute; 