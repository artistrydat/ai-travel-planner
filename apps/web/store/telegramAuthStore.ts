import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TelegramUser } from '../types/telegram';

interface TelegramAuthState {
  // Authentication state
  isTelegram: boolean;
  isVerified: boolean;
  initData: string | null;
  telegramUser: TelegramUser | null;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTelegramData: (initData: string, user: TelegramUser) => void;
  setVerified: (verified: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  
  // Helper methods
  isAuthenticated: () => boolean;
  getTelegramUserId: () => number | null;
}

export const useTelegramAuthStore = create<TelegramAuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isTelegram: false,
      isVerified: false,
      initData: null,
      telegramUser: null,
      isLoading: false,
      error: null,

      // Actions
      setTelegramData: (initData: string, user: TelegramUser) => {
        set({
          isTelegram: true,
          initData,
          telegramUser: user,
          error: null,
        });
      },

      setVerified: (verified: boolean) => {
        set({ isVerified: verified, error: verified ? null : 'Authentication failed' });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearAuth: () => {
        set({
          isTelegram: false,
          isVerified: false,
          initData: null,
          telegramUser: null,
          isLoading: false,
          error: null,
        });
      },

      // Helper methods
      isAuthenticated: () => {
        const state = get();
        return state.isTelegram && state.isVerified && !!state.telegramUser;
      },

      getTelegramUserId: () => {
        const state = get();
        return state.telegramUser?.id || null;
      },
    }),
    {
      name: 'telegram-auth-storage',
      storage: createJSONStorage(() => {
        // Use sessionStorage for security - don't persist across browser sessions
        if (typeof window !== 'undefined') {
          return sessionStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Only persist essential non-sensitive data
      partialize: (state) => ({
        isTelegram: state.isTelegram,
        telegramUser: state.telegramUser,
        // Don't persist initData for security
      }),
    }
  )
);
