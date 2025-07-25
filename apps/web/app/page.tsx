"use client";

import React, { useEffect, useMemo, useCallback, useState } from 'react';
import Header from '../components/mainpage/Header';
import PlannerControls from '../components/mainpage/PlannerControls';
import ItineraryView from '../components/itinerary/ItineraryView';
import ProfileModal from '../components/profile/ProfileModal';
import ExportModal from '../components/auxiliary/ExportModal';
import FeatureRequestModal from '../components/auxiliary/FeatureRequestModal';
import UnifiedCreditsModal from '../components/shared/UnifiedCreditsModal';
import Map from '../components/mainpage/Map';
import ItineraryCarousel from '../components/itinerary/ItineraryCarousel';
import TelegramGuard from '../components/auxiliary/TelegramGuard';
import WelcomeNotification from '../components/mainpage/WelcomeNotification';
import { Icon } from '../components/common/Icon';

import { useMutation } from '@tanstack/react-query';
import { generateItinerary } from '../lib/actions';
import { fetchPlacePhotos } from '../lib/googleMapsService';
import { useItineraryCosts } from '../hooks/useOperationCosts';
import useTelegram from '../hooks/useTelegram';
import { useTelegramAuthStore } from '../store/telegramAuthStore';

import { useUIStore } from '../store/uiStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { useItineraryStore } from '../store/itineraryStore';
import { useUserStore } from '../store/userStore';
import { Itinerary, PlannerPreferences } from '../types/types';

// Import the new Convex hooks
import { 
  useUserByTelegramId, 
  useUpdateUserCredits, 
  useAddSearchHistory, 
  useSetUserPreferences 
} from '../hooks/useConvexQueries';
import { convexService } from '../lib/convexService';
import { usePerformanceMonitor, useSafeCallback, useDebounce } from '../hooks/usePerformance';

const App: React.FC = () => {
  // Performance monitoring
  const renderCount = usePerformanceMonitor('App');
  
  // Track new user status for welcome notification
  const [isNewUser, setIsNewUser] = useState(false);
  
  const { 
    isItineraryViewOpen, 
    isProfileModalOpen, 
    isExportModalOpen, 
    isFeatureRequestModalOpen,
    isCreditsModalOpen,
    error,
    setPlannerMode, 
    closeProfileModal, 
    closeCreditsModal,
    openItinerary,
    openFeatureRequestModal,
    setError,
    setSelectedActivityIndex,
  } = useUIStore();

  const { preferences, resetPreferences } = usePreferencesStore();
  const { itinerary, setItinerary, resetItinerary } = useItineraryStore();
  const { 
    user,
    userProfile,
    credits, 
    initializeUser,
    isLoading: userLoading,
    error: userError,
    setUserData,
  } = useUserStore();

  // Get Telegram user data from the new auth system
  const { getTelegramUser } = useTelegram();
  const { telegramUser: authTelegramUser } = useTelegramAuthStore();
  const telegramUser = useMemo(() => authTelegramUser || getTelegramUser(), [authTelegramUser, getTelegramUser]);
  
  // Use Convex reactive queries with less frequent updates
  const { data: liveUser, isLoading: userQueryLoading } = useUserByTelegramId(telegramUser?.id?.toString() || null);
  const updateCreditsMutation = useUpdateUserCredits();
  const addSearchHistoryMutation = useAddSearchHistory();
  const setPreferencesMutation = useSetUserPreferences();

  // Debounced user data update
  const debouncedSetUserData = useDebounce(setUserData, 1000);
  
  // Get current duration and calculate costs using the new hook
  const days = parseInt(preferences.duration, 10) || 1;
  const { cost: itineraryCost, canAfford, formattedCost, formattedUserCredits } = useItineraryCosts(days);

  // Initialize user on app load (only once)
  useEffect(() => {
    console.log('=== App Initialization Debug ===');
    console.log('User loading:', userLoading);
    console.log('User error:', userError);
    console.log('Telegram user:', telegramUser);
    
    if (!user && !userLoading && telegramUser) {
      console.log('Initializing user...');
      initializeUser().then((wasNewUser) => {
        console.log('User initialization completed, was new user:', wasNewUser);
        // Set the new user state for welcome notification
        setIsNewUser(wasNewUser);
        
        // If this was a new user, refresh the mini app to show updated credits
        if (wasNewUser) {
          console.log('New user detected, refreshing Telegram app in 3 seconds...');
          setTimeout(() => {
            convexService.refreshTelegramApp();
          }, 3000);
        }
      }).catch((error) => {
        console.error('Failed to initialize user:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize user');
      });
    }
  }, [telegramUser?.id, user?._id, initializeUser]); // Only depend on telegram user ID and current user

  // Update local state when live data changes (debounced)
  useEffect(() => {
    if (liveUser && telegramUser && !userLoading && liveUser._id !== user?._id) {
      console.log('Updating user data from live user (render count:', renderCount, ')');
      debouncedSetUserData(liveUser, {
        name: liveUser.firstName || 'User',
        handle: `@${liveUser.username || liveUser.telegramId}`,
        id: liveUser.telegramId,
      });
    }
  }, [liveUser?._id, liveUser?.credits]); // Minimal dependencies

  const mutation = useMutation({
    mutationFn: async (prefs: PlannerPreferences) => {
      const generatedItinerary = await generateItinerary(prefs);
      
      // Wait a bit to ensure Google Maps API is fully loaded
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const activitiesWithPhotos = await fetchPlacePhotos(generatedItinerary.itinerary);
      return { ...generatedItinerary, itinerary: activitiesWithPhotos };
    },
    onSuccess: async (data: Itinerary) => {
      setItinerary(data);
      setSelectedActivityIndex(0);
      setPlannerMode(false);
      
      const days = parseInt(preferences.duration, 10) || 1;
      const cost = itineraryCost; // Use the cost from the hook
      
      if (user) {
        // Use Convex mutations
        await updateCreditsMutation.mutateAsync({
          userId: user._id,
          amount: -cost,
          action: `Plan: ${data.destination} (${days} day${days === 1 ? '' : 's'})`,
        });

        const searchLog = {
          id: Date.now(),
          destination: data.destination,
          date: new Date().toISOString(),
          preferences: preferences,
          itinerary: data,
        };

        await addSearchHistoryMutation.mutateAsync({
          userId: user._id,
          searchData: searchLog,
        });

        await setPreferencesMutation.mutateAsync({
          userId: user._id,
          preferences: preferences,
        });
      }
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  const handleGeneratePlan = useSafeCallback(async () => {
    if (!user || !userProfile) {
      setError("Please wait for user initialization or restart the app.");
      return;
    }
    
    if (!preferences.destination || !preferences.interests) {
      setError("Please provide a destination and your interests.");
      return;
    }
    
    // Use the affordability check from the hook
    if (!canAfford) {
      setError(`Not enough credits. This trip costs ${formattedCost}, but you only have ${formattedUserCredits}.`);
      return;
    }
    
    setItinerary(null);
    mutation.mutate(preferences);
  }, [user, userProfile, preferences, canAfford, formattedCost, formattedUserCredits, mutation.mutate]);

  const handleReset = useSafeCallback(() => {
    resetPreferences();
    resetItinerary();
    setSelectedActivityIndex(null);
    setPlannerMode(false);
    mutation.reset();
  }, [resetPreferences, resetItinerary, setSelectedActivityIndex, setPlannerMode, mutation.reset]);

  // Show loading state while user is being initialized
  if (userLoading) {
    return (
      <div className="relative h-screen w-screen bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="text-white text-center">
          <svg className="animate-spin h-10 w-10 text-indigo-400 mb-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold">Initializing your account...</p>
        </div>
      </div>
    );
  }

  // Show error state if user initialization failed
  if (userError && !user && !userProfile) {
    return (
      <div className="relative h-screen w-screen bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="text-white text-center max-w-md">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Initialization Failed</h2>
          <p className="text-gray-300 mb-4 text-sm">{userError}</p>
          <button 
            onClick={initializeUser}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <TelegramGuard>
      <div className="relative h-screen w-screen bg-gray-900 overflow-hidden">
        {/* Background Map */}
        <Map />
        
        {/* Welcome Notification for new users */}
        <WelcomeNotification 
          isNewUser={isNewUser} 
          userName={userProfile?.name || user?.firstName || 'User'} 
        />
        
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
        <FeatureRequestModal isOpen={isFeatureRequestModalOpen} />
        <UnifiedCreditsModal isOpen={isCreditsModalOpen} onClose={closeCreditsModal} />

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

         {/* Footer */}
         <div className="absolute bottom-4 left-4 z-20">
             <button
               onClick={openFeatureRequestModal}
               className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
               title="Request a feature"
             >
               <Icon name="lightbulb" className="w-5 h-5" />
             </button>
         </div>
      </div>

    </TelegramGuard>
  );
};

export default App;
