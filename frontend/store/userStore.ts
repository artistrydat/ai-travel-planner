import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SearchHistoryItem, CreditHistoryItem, UserProfile } from '../types';
import { convexService, ConvexUser, ConvexSearchHistory, ConvexCreditHistory } from '../lib/convexService';
import { Id } from '../convex/_generated/dataModel';

type UserState = {
  // User data
  user: ConvexUser | null;
  userProfile: UserProfile | null;
  credits: number;
  searchHistory: SearchHistoryItem[];
  creditHistory: CreditHistoryItem[];
  isLoading: boolean;
  error: string | null;
};

type UserActions = {
  // User initialization
  initializeUser: () => Promise<boolean>; // Returns true if user was newly created
  setUser: (user: ConvexUser) => void;
  setUserData: (user: ConvexUser, profile: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Credits
  addCredits: (amount: number, action?: string) => Promise<void>;
  deductCredits: (amount: number, action?: string) => Promise<void>;
  
  // History
  addSearchHistoryItem: (item: SearchHistoryItem) => Promise<void>;
  addCreditHistoryItem: (item: CreditHistoryItem) => void;
  
  // Data fetching
  fetchUserData: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  savePreferencesToConvex: () => Promise<void>;
  
  // Utility
  convertConvexSearchHistory: (convexHistory: ConvexSearchHistory[]) => SearchHistoryItem[];
  convertConvexCreditHistory: (convexHistory: ConvexCreditHistory[]) => CreditHistoryItem[];
};

export const useUserStore = create(
  persist<UserState & UserActions>(
    (set, get) => ({
      // Initial state
      user: null,
      userProfile: null,
      credits: 0,
      searchHistory: [],
      creditHistory: [],
      isLoading: false,
      error: null,
      
      // Initialize user from Telegram data
      initializeUser: async (): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });
          
          const telegramUser = convexService.getTelegramUser();
          console.log('Telegram user data:', telegramUser);
          
          if (!telegramUser) {
            throw new Error('No Telegram user data available. Please open this app from Telegram.');
          }
          
          // Check if user already exists
          console.log('Checking if user exists in Convex...');
          const existingUser = await convexService.getUserByTelegramId(telegramUser.id);
          const isNewUser = !existingUser;
          
          // Get or create user in Convex
          console.log('Creating/fetching user in Convex...');
          const convexUser = await convexService.getOrCreateUser(telegramUser);
          console.log('Convex user:', convexUser);
          
          // Set user profile
          const userProfile: UserProfile = {
            name: convexUser.firstName || 'User',
            handle: `@${convexUser.username || convexUser.telegramId}`,
            id: convexUser.telegramId,
          };
          
          set({ 
            user: convexUser, 
            userProfile,
            credits: convexUser.credits 
          });
          
          // Fetch additional user data
          console.log('Fetching additional user data...');
          await get().fetchUserData();
          
          console.log('User initialization completed successfully');
          
          return isNewUser;
          
        } catch (error) {
          console.error('Error initializing user:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to initialize user';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      setUser: (user) => set({ user, credits: user.credits }),
      setUserData: (user: ConvexUser, profile: UserProfile) => {
        set({
          user,
          userProfile: profile,
          credits: user.credits,
        });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // Fetch user data from Convex with better error handling
      fetchUserData: async () => {
        const { user } = get();
        if (!user) {
          throw new Error('No user session available. Please restart the app.');
        }
        
        try {
          set({ isLoading: true, error: null });
          const userData = await convexService.getUserData(user._id);
          
          const searchHistory = get().convertConvexSearchHistory(userData.searchHistory || []);
          const creditHistory = get().convertConvexCreditHistory(userData.creditHistory || []);
          
          set({ searchHistory, creditHistory, isLoading: false });
          console.log('UserStore: fetchUserData completed successfully');
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Don't fail completely, just set empty arrays and log the error
          set({ 
            searchHistory: [],
            creditHistory: [],
            error: error instanceof Error ? error.message : 'Failed to fetch user data',
            isLoading: false 
          });
          throw error; // Re-throw to allow fallback handling
        }
      },

      // Refresh complete user profile including current credits
      refreshUserProfile: async () => {
        const telegramUser = convexService.getTelegramUser();
        if (!telegramUser) {
          throw new Error('No Telegram user data available.');
        }
        
        try {
          console.log('UserStore: Starting refreshUserProfile for telegramId:', telegramUser.id);
          set({ isLoading: true, error: null });
          
          // Get fresh user profile with current credits
          const freshUser = await convexService.getUserProfile(telegramUser.id);
          console.log('UserStore: Fresh user data from backend:', freshUser);
          
          // Update user and credits
          set({ 
            user: freshUser, 
            credits: freshUser.credits 
          });
          console.log('UserStore: Updated store with credits:', freshUser.credits);
          
          // Fetch updated history data
          try {
            const userData = await convexService.getUserData(freshUser._id);
            const searchHistory = get().convertConvexSearchHistory(userData.searchHistory || []);
            const creditHistory = get().convertConvexCreditHistory(userData.creditHistory || []);
            console.log('UserStore: Updated credit history items:', creditHistory.length);
            
            set({ searchHistory, creditHistory, isLoading: false });
          } catch (historyError) {
            console.warn('Failed to fetch history data, using empty arrays:', historyError);
            set({ 
              searchHistory: [], 
              creditHistory: [], 
              isLoading: false 
            });
          }
          
        } catch (error) {
          console.error('Error refreshing user profile:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to refresh user profile',
            isLoading: false 
          });
          throw error; // Re-throw to allow fallback handling
        }
      },

      // Credits management
      addCredits: async (amount, action = 'Credit added') => {
        const { user } = get();
        if (!user) {
          throw new Error('No user session available. Please restart the app.');
        }
        
        try {
          const newCredits = await convexService.updateCredits(user._id, amount, action);
          set({ credits: newCredits });
          
          // Fetch updated credit history
          await get().fetchUserData();
        } catch (error) {
          console.error('Error adding credits:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to add credits' });
        }
      },
      
      deductCredits: async (amount, action = 'Credits used') => {
        const { user } = get();
        if (!user) {
          throw new Error('No user session available. Please restart the app.');
        }
        
        try {
          const newCredits = await convexService.updateCredits(user._id, -amount, action);
          set({ credits: newCredits });
          
          // Fetch updated credit history
          await get().fetchUserData();
        } catch (error) {
          console.error('Error deducting credits:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to deduct credits' });
        }
      },

      // Search history
      addSearchHistoryItem: async (item) => {
        const { user } = get();
        if (!user) {
          throw new Error('No user session available. Please restart the app.');
        }
        
        try {
          await convexService.addSearchHistory(
            user._id,
            item.destination,
            item.preferences,
            item.itinerary
          );
          
          // Update local state
          set(state => ({
            searchHistory: [...state.searchHistory, item]
          }));
        } catch (error) {
          console.error('Error adding search history:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to save search history' });
        }
      },
      
      // This is kept for local state management (before sync)
      addCreditHistoryItem: (item) => set(state => ({
        creditHistory: [...state.creditHistory, item]
      })),

      // Save preferences to Convex
      savePreferencesToConvex: async () => {
        const { user } = get();
        if (!user) throw new Error('No user found');

        // Get preferences from preferences store
        const preferencesStore = await import('./preferencesStore');
        const { preferences } = preferencesStore.usePreferencesStore.getState();
        
        await convexService.setPreferences(user._id, preferences);
      },
      
      // Utility functions to convert Convex data to local format
      convertConvexSearchHistory: (convexHistory): SearchHistoryItem[] => {
        return convexHistory.map(item => ({
          id: item.createdAt, // Use timestamp as ID
          destination: item.destination,
          date: new Date(item.createdAt).toISOString(),
          preferences: {
            destination: item.preferences.destination,
            departureCity: item.preferences.departureCity,
            duration: item.preferences.duration,
            startDate: item.preferences.startDate,
            pace: item.preferences.pace as 'Relaxed' | 'Moderate' | 'Packed',
            group: item.preferences.group as 'Solo' | 'Couple' | 'Family' | 'Friends',
            interests: item.preferences.interests,
          },
          itinerary: item.itinerary,
        }));
      },
      
      convertConvexCreditHistory: (convexHistory): CreditHistoryItem[] => {
        return convexHistory.map(item => ({
          id: item.createdAt, // Use timestamp as ID
          date: new Date(item.createdAt).toLocaleString(),
          action: item.action,
          amount: item.amount,
          balance: item.balanceAfter,
        }));
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
