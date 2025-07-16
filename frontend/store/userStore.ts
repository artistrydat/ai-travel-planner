import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SearchHistoryItem, CreditHistoryItem } from '../types';

type UserState = {
  credits: number;
  searchHistory: SearchHistoryItem[];
  creditHistory: CreditHistoryItem[];
};

type UserActions = {
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => void;
  addSearchHistoryItem: (item: SearchHistoryItem) => void;
  addCreditHistoryItem: (item: CreditHistoryItem) => void;
};

export const useUserStore = create(
  persist<UserState & UserActions>(
    (set) => ({
      credits: 20, // Initial credits for a new user
      searchHistory: [],
      creditHistory: [],
      
      addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
      
      deductCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),

      addSearchHistoryItem: (item) => set((state) => ({
        searchHistory: [...state.searchHistory, item]
      })),
      
      addCreditHistoryItem: (item) => set((state) => ({
        creditHistory: [...state.creditHistory, item]
      })),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
