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
};

type PreferencesState = {
  preferences: PlannerPreferences;
};

type PreferencesActions = {
  setPreference: <K extends keyof PlannerPreferences>(key: K, value: PlannerPreferences[K]) => void;
  setPlace: (field: 'destination' | 'departureCity', value: string) => void;
  setAllPreferences: (prefs: PlannerPreferences) => void;
  resetPreferences: () => void;
};

export const usePreferencesStore = create<PreferencesState & PreferencesActions>((set) => ({
  preferences: initialState,
  setPreference: (key, value) => set((state) => ({
    preferences: { ...state.preferences, [key]: value }
  })),
  setPlace: (field, value) => set((state) => ({
    preferences: { ...state.preferences, [field]: value }
  })),
  setAllPreferences: (prefs) => set({ preferences: prefs }),
  resetPreferences: () => set({ preferences: initialState }),
}));
