import { create } from 'zustand';

type UIState = {
  isPlannerMode: boolean;
  isProfileModalOpen: boolean;
  isItineraryViewOpen: boolean;
  isExportModalOpen: boolean;
  isFeatureRequestModalOpen: boolean;
  isCreditsModalOpen: boolean;
  selectedActivityIndex: number | null;
  error: string | null;
};

type UIActions = {
  setPlannerMode: (isPlanner: boolean) => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openItinerary: () => void;
  closeItinerary: () => void;
  openExportModal: () => void;
  closeExportModal: () => void;
  openFeatureRequestModal: () => void;
  closeFeatureRequestModal: () => void;
  openCreditsModal: () => void;
  closeCreditsModal: () => void;
  setSelectedActivityIndex: (index: number | null) => void;
  setError: (error: string | null) => void;
};

let errorTimeout: number | undefined;

export const useUIStore = create<UIState & UIActions>((set) => ({
  isPlannerMode: false,
  isProfileModalOpen: false,
  isItineraryViewOpen: false,
  isExportModalOpen: false,
  isFeatureRequestModalOpen: false,
  isCreditsModalOpen: false,
  selectedActivityIndex: null,
  error: null,
  
  setPlannerMode: (isPlanner) => set({ isPlannerMode: isPlanner }),
  
  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),
  
  openItinerary: () => set({ isItineraryViewOpen: true }),
  closeItinerary: () => set({ isItineraryViewOpen: false }),

  openExportModal: () => set({ isExportModalOpen: true }),
  closeExportModal: () => set({ isExportModalOpen: false }),

  openFeatureRequestModal: () => set({ isFeatureRequestModalOpen: true }),
  closeFeatureRequestModal: () => set({ isFeatureRequestModalOpen: false }),

  openCreditsModal: () => set({ isCreditsModalOpen: true }),
  closeCreditsModal: () => set({ isCreditsModalOpen: false }),

  setSelectedActivityIndex: (index) => set({ selectedActivityIndex: index }),

  setError: (error) => {
    if (errorTimeout) clearTimeout(errorTimeout);
    set({ error });
    if (error) {
      errorTimeout = window.setTimeout(() => set({ error: null }), 5000);
    }
  },
}));
