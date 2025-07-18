import { create } from 'zustand';
import { PlannerPreferences } from '../types';

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const initialState: PlannerPreferences = {
  destination: '',
  departureCity: '',
  duration: '3',
  startDate: getTodayDateString(),
  pace: 'Moderate',
  group: 'Solo',
  interests: '',
  budget: '',
};

type PreferencesState = {
  preferences: PlannerPreferences;
  isLoading: boolean;
  error: string | null;
};

type PreferencesActions = {
  setPreference: <K extends keyof PlannerPreferences>(key: K, value: PlannerPreferences[K]) => void;
  setPlace: (field: 'destination' | 'departureCity', value: string) => void;
  setAllPreferences: (prefs: PlannerPreferences) => void;
  resetPreferences: () => void;
  savePreferencesToConvex: () => Promise<void>;
  loadPreferencesFromConvex: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const usePreferencesStore = create<PreferencesState & PreferencesActions>((set, get) => ({
  preferences: initialState,
  isLoading: false,
  error: null,
  
  setPreference: (key, value) => set((state) => ({
    preferences: { ...state.preferences, [key]: value }
  })),
  
  setPlace: (field, value) => set((state) => ({
    preferences: { ...state.preferences, [field]: value }
  })),
  
  setAllPreferences: (prefs) => set({ preferences: prefs }),
  
  resetPreferences: () => set({ preferences: initialState }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Note: Preferences sync is now handled by TanStack Query mutations
  // These functions are kept for backward compatibility
  savePreferencesToConvex: async () => {
    console.log('savePreferencesToConvex: Now handled by TanStack Query mutations');
  },
  
  loadPreferencesFromConvex: async () => {
    console.log('loadPreferencesFromConvex: Now handled by TanStack Query hooks');
  },
}));
