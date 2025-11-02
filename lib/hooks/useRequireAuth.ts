'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Custom hook to require authentication for a page or component
 * Automatically redirects to /sign-in if user is not authenticated
 *
 * Usage:
 * const { isLoaded, isSignedIn } = useRequireAuth();
 *
 * if (!isLoaded) return <LoadingSpinner />;
 *
 * return <YourProtectedContent />;
 */
export function useRequireAuth() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  return { isLoaded, isSignedIn };
}
