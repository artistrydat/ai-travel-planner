"use client";

import React from 'react';
import Header from '../components/Header';
import PlannerControls from '../components/PlannerControls';
import ItineraryView from '../components/ItineraryView';
import ProfileModal from '../components/ProfileModal';
import ExportModal from '../components/ExportModal';
import Map from '../components/Map';
import ItineraryCarousel from '../components/ItineraryCarousel';

import { useMutation } from '@tanstack/react-query';
import { generateItinerary } from '../lib/actions';
import { fetchPlacePhotos } from '../lib/googleMapsService';

import { useUIStore } from '../store/uiStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { useItineraryStore } from '../store/itineraryStore';
import { useUserStore } from '../store/userStore';
import { Itinerary, PlannerPreferences } from '../types';

const App: React.FC = () => {
  const { 
    isItineraryViewOpen, 
    isProfileModalOpen, 
    isExportModalOpen, 
    error,
    setPlannerMode, 
    closeProfileModal, 
    openItinerary,
    setError,
    setSelectedActivityIndex,
  } = useUIStore();

  const { preferences, resetPreferences } = usePreferencesStore();
  const { itinerary, setItinerary, resetItinerary } = useItineraryStore();
  const { credits, deductCredits, addCreditHistoryItem, addSearchHistoryItem } = useUserStore();

  const mutation = useMutation({
    mutationFn: async (prefs: PlannerPreferences) => {
      const generatedItinerary = await generateItinerary(prefs);
      
      // Wait a bit to ensure Google Maps API is fully loaded
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const activitiesWithPhotos = await fetchPlacePhotos(generatedItinerary.itinerary);
      return { ...generatedItinerary, itinerary: activitiesWithPhotos };
    },
    onSuccess: (data: Itinerary) => {
      setItinerary(data);
      setSelectedActivityIndex(0);
      setPlannerMode(false);
      
      const cost = parseInt(preferences.duration, 10) || 1;
      deductCredits(cost);

      const creditLog = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        action: `Plan: ${data.destination}`,
        amount: -cost,
        balance: credits - cost,
      };
      addCreditHistoryItem(creditLog);

      const searchLog = {
        id: Date.now(),
        destination: data.destination,
        date: new Date().toISOString(),
        preferences: preferences,
        itinerary: data,
      };
      addSearchHistoryItem(searchLog);
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  const handleGeneratePlan = () => {
    if (!preferences.destination || !preferences.interests) {
      setError("Please provide a destination and your interests.");
      return;
    }
    const cost = parseInt(preferences.duration, 10);
    if(credits < cost) {
      setError(`Not enough credits. This trip costs ${cost}, but you only have ${credits}.`);
      return;
    }
    setItinerary(null);
    mutation.mutate(preferences);
  };

  const handleReset = () => {
    resetPreferences();
    resetItinerary();
    setSelectedActivityIndex(null);
    setPlannerMode(false);
    mutation.reset();
  };

  return (
    <div className="relative h-screen w-screen bg-gray-900 overflow-hidden">
      {/* Background Map */}
      <Map />
      
      {/* Main UI Overlay */}
      <div className="absolute inset-0 z-10 h-full w-full p-3 md:p-5 flex flex-col pointer-events-none">
        <Header />
        
        <main className="flex-grow flex flex-col justify-start items-center pt-4 md:pt-6 pointer-events-auto">
          <PlannerControls
            isLoading={mutation.isPending}
            onGeneratePlan={handleGeneratePlan}
            itineraryGenerated={!!itinerary}
            onViewItinerary={openItinerary}
            onReset={handleReset}
          />
        </main>
      </div>

      {/* Itinerary Carousel */}
      {itinerary && <ItineraryCarousel />}
      
      {/* Itinerary Side Panel */}
      <ItineraryView />
      
      {/* Modals */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
      <ExportModal isOpen={isExportModalOpen} />

       {/* Loading and Error states */}
       {mutation.isPending && (
         <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <svg className="animate-spin h-10 w-10 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold">Crafting your perfect journey...</p>
            <p className="text-sm text-gray-300">This might take a moment.</p>
         </div>
       )}

       {error && (
          <div className="absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-pink-600 to-orange-500 text-white px-6 py-3 rounded-lg shadow-2xl" role="alert">
            <strong className="font-bold">Oh no! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
       )}
    </div>
  );
};

export default App;
