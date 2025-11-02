'use client';

import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/themeStore';
import { Button } from '@/app/components/ui/Button';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const { theme } = useThemeStore();

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

        <h1 className="text-4xl font-bold mb-3">404</h1>
        <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>

        <p
          className={`mb-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          <Button
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}