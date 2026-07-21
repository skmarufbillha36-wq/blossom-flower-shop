import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@flower-shop/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

/**
 * Global authentication state store.
 * Persisted to localStorage so user stays logged in on page refresh.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (token, user) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, isAdmin: user.role === 'ADMIN' });
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Ignore logout API errors
        } finally {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
        }
      },

      setUser: (user) => set({ user, isAdmin: user.role === 'ADMIN' }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
