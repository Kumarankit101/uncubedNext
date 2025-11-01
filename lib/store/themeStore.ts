import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to document
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Initialize theme on app start
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('theme-storage');
  if (storedTheme) {
    try {
      const parsed = JSON.parse(storedTheme);
      document.documentElement.classList.toggle('dark', parsed.state.theme === 'dark');
    } catch (e) {
      // Fallback to light theme
      document.documentElement.classList.remove('dark');
    }
  } else {
    // Default to light theme
    document.documentElement.classList.remove('dark');
  }
}