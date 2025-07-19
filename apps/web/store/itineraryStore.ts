import { create } from 'zustand';
import { Itinerary } from '../types/types';

type ItineraryState = {
  itinerary: Itinerary | null;
};

type ItineraryActions = {
  setItinerary: (itinerary: Itinerary | null) => void;
  resetItinerary: () => void;
};

export const useItineraryStore = create<ItineraryState & ItineraryActions>((set) => ({
  itinerary: null,
  setItinerary: (itinerary) => set({ itinerary }),
  resetItinerary: () => set({ itinerary: null }),
}));
