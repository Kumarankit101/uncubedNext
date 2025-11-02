'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/layout/Header';
import { AuthSync } from '@/app/components/AuthSync';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Loading state - show nothing while checking auth
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-400 border-t-gray-900"></div>
      </div>
    );
  }

  // Not signed in - don't render content (redirect will happen in useEffect)
  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <AuthSync />
      <Header />
      <main className="pt-24 px-6 pb-16">
        {children}
      </main>
    </>
  );
}
