'use client';

// Force dynamic rendering to avoid prerender issues with error pages
export const dynamic = 'force-dynamic';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold mb-3">Something went wrong!</h1>
            <p className="mb-6 text-gray-600">{error.message || 'An unexpected error occurred'}</p>
            <button
              onClick={reset}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
