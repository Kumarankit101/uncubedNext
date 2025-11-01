'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAuthStore } from '@/lib/store/authStore';

/**
 * AuthSync Component
 * Syncs Clerk user data to Zustand authStore
 * Should be placed in a layout that wraps authenticated sections
 */
export function AuthSync() {
  const { user, isLoaded } = useUser();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      // Sync user data from Clerk to authStore
      setUser({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.firstName || user.fullName || 'User',
        credits: 100, // Default credits, should be fetched from backend
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      });
    } else {
      // Clear user data when logged out
      setUser(null);
    }
  }, [isLoaded, user, setUser]);

  return null;
}
