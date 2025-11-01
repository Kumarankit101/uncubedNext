'use client';

import { SignUp } from '@clerk/nextjs';
import { useThemeStore } from '@/lib/store/themeStore';

export default function SignUpPage() {
  const { theme } = useThemeStore();

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        theme === 'dark'
          ? 'bg-black text-white'
          : 'bg-light-50 text-gray-900'
      }`}
    >
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            baseTheme: theme === 'dark' ? undefined : undefined,
            elements: {
              rootBox: 'w-full',
              card: theme === 'dark'
                ? 'bg-gray-900 border border-gray-800'
                : 'bg-white border border-gray-200',
              headerTitle: theme === 'dark'
                ? 'text-white'
                : 'text-gray-900',
              headerSubtitle: theme === 'dark'
                ? 'text-gray-400'
                : 'text-gray-600',
              socialButtonsBlockButton: theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200',
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
              formFieldInput: theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900',
            },
          }}
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
