'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';

// Force dynamic rendering to prevent prerender issues with dependencies
export const dynamic = 'force-dynamic';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service if needed
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold mb-3">Something Went Wrong</h1>

        <p className="mb-6 text-gray-600">
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 rounded text-sm text-left bg-gray-100 border border-gray-300">
            <p className="font-mono text-xs break-words">{error.toString()}</p>
            {error.digest && (
              <p className="font-mono text-xs mt-2">Digest: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="px-6 py-2.5 bg-gray-100 text-gray-900 border border-gray-300 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
