'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/themeStore';
import { Button } from '@/app/components/ui/Button';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Log error to monitoring service if needed
    console.error('Application error:', error);
  }, [error]);

  const isAuthError = error.message?.includes('auth') || error.message?.includes('Clerk');

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        theme === 'dark'
          ? 'bg-black text-white'
          : 'bg-light-50 text-gray-900'
      }`}
    >
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle
            className={`w-16 h-16 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}
          />
        </div>

        <h1 className="text-2xl font-bold mb-3">
          {isAuthError ? 'Authentication Error' : 'Something Went Wrong'}
        </h1>

        <p
          className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {isAuthError
            ? 'We encountered an issue with authentication. Please try signing in again.'
            : error.message ||
              'An unexpected error occurred. Please try again later.'}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div
            className={`mb-6 p-4 rounded text-sm text-left ${
              theme === 'dark'
                ? 'bg-gray-900 border border-gray-800'
                : 'bg-gray-100 border border-gray-300'
            }`}
          >
            <p className="font-mono text-xs break-words">{error.toString()}</p>
            {error.digest && (
              <p className="font-mono text-xs mt-2">Digest: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>

          <Button
            onClick={() => router.push('/')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>

        {isAuthError && (
          <Button
            onClick={() => router.push('/sign-in')}
            variant="secondary"
            className="w-full mt-3"
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
