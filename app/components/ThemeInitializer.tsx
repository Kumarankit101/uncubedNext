'use client';

import { useLayoutEffect } from 'react';
import { useThemeStore } from '@/lib/store/themeStore';

/**
 * ThemeInitializer handles theme initialization on the client side
 * Uses useLayoutEffect to apply theme before first paint to avoid hydration mismatch
 */
export function ThemeInitializer() {
  useLayoutEffect(() => {
    // Get stored theme from localStorage
    try {
      const storedTheme = localStorage.getItem('theme-storage');
      if (storedTheme) {
        const parsed = JSON.parse(storedTheme);
        const theme = parsed.state?.theme || 'light';

        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        // Sync with store
        useThemeStore.setState({ theme });
      } else {
        // Default to light theme
        document.documentElement.classList.remove('dark');
        useThemeStore.setState({ theme: 'light' });
      }
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Fallback to light theme
      document.documentElement.classList.remove('dark');
      useThemeStore.setState({ theme: 'light' });
    }
  }, []);

  return null;
}
