import { create } from 'zustand';
import { getUser, setUser as persistUser, removeAuthToken, setAuthToken, setRefreshToken } from '../lib/auth';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  faceVerified: false,
  isFrozen: false,

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

  setFaceVerified: (verified) => set({ faceVerified: verified }),

  setFrozen: (frozen) => set({ isFrozen: frozen }),

  logout: async () => {
    try {
      const { auth } = await import('../lib/api');
      await auth.logout();
    } catch (e) {
      console.warn('Backend logout failed:', e);
    }
    removeAuthToken();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ft_face_verified');
      sessionStorage.removeItem('ft_face_descriptor');
      sessionStorage.removeItem('ft_face_threshold');
    }
    set({ user: null, error: null, faceVerified: false, isFrozen: false });
  },

  clearError: () => set({ error: null }),
}));

