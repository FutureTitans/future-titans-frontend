import { create } from 'zustand';
import { getUser, setUser as persistUser, removeAuthToken, setAuthToken, setRefreshToken } from '../lib/auth';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  /**
   * Hydrate user from client-side storage.
   * Called from client components (e.g., Navbar) in useEffect
   * to avoid SSR/client hydration mismatches.
   */
  hydrateUser: () => {
    if (typeof window === 'undefined') return;
    const stored = getUser();
    if (stored) {
      set({ user: stored });
    }
  },

  setUser: (user) => {
    persistUser(user);
    set({ user });
  },

  setTokens: (accessToken, refreshToken) => {
    setAuthToken(accessToken);
    setRefreshToken(refreshToken);
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  logout: () => {
    removeAuthToken();
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

