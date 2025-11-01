import { create } from 'zustand';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    try {
      set({ user: null });
      // Clerk signOut should be called from a React component using useClerk hook
      // Here we just clear local state and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      set({ user: null });
      window.location.href = '/';
    }
  },
}));