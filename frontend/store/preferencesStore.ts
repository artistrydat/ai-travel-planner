import { create } from 'zustand';
import { PlannerPreferences } from '../types';
import { convexService } from '../lib/convexService';
import { useUserStore } from './userStore';

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
  
  // Save preferences to Convex
  savePreferencesToConvex: async () => {
    const { preferences } = get();
    const userStore = useUserStore.getState();
    
    if (!userStore.user) {
      set({ error: 'No user found' });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      await convexService.setPreferences(userStore.user._id, preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to save preferences' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Load preferences from Convex
  loadPreferencesFromConvex: async () => {
    const userStore = useUserStore.getState();
    
    if (!userStore.user) {
      set({ error: 'No user found' });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      const userData = await convexService.getUserData(userStore.user._id);
      
      if (userData.preferences) {
        // Convert Convex preferences to PlannerPreferences format
        const convertedPreferences: PlannerPreferences = {
          destination: userData.preferences.destination,
          departureCity: userData.preferences.departureCity,
          duration: userData.preferences.duration,
          startDate: userData.preferences.startDate,
          pace: userData.preferences.pace as 'Relaxed' | 'Moderate' | 'Packed',
          group: userData.preferences.group as 'Solo' | 'Couple' | 'Family' | 'Friends',
          interests: userData.preferences.interests,
        };
        set({ preferences: convertedPreferences });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load preferences' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
