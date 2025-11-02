'use client';

import { SignUp } from '@clerk/nextjs';
import { useThemeStore } from '@/lib/store/themeStore';
import { useClerkAppearance } from '@/lib/hooks/useClerkAppearance';

export default function SignUpPage() {
  const { theme } = useThemeStore();
  const getAppearance = useClerkAppearance();

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
          appearance={getAppearance()}
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
