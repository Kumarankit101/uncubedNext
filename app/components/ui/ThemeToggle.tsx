import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/lib/store/themeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
        theme === 'dark'
          ? 'text-gray-300 hover:text-white'
          : 'text-gray-600 hover:text-gray-900'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-[#EBB207]" />
      ) : (
        <Moon className="w-4 h-4 text-black" />
      )}

    </button>
  );
};