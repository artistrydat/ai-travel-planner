"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../common/Icon';
import { usePreferencesStore } from '../../store/preferencesStore';
import { useUIStore } from '../../store/uiStore';
import { useItineraryCosts } from '../../hooks/useOperationCosts';

interface PlannerControlsProps {
  onGeneratePlan: () => void;
  isLoading: boolean;
  itineraryGenerated: boolean;
  onViewItinerary: () => void;
  onReset: () => void;
}

const PlannerControls: React.FC<PlannerControlsProps> = ({
  onGeneratePlan,
  isLoading,
  itineraryGenerated,
  onViewItinerary,
  onReset
}) => {
  const { preferences, setPreference, setPlace, resetPreferences } = usePreferencesStore();
  const { isPlannerMode, setPlannerMode } = useUIStore();
  const [showPreferences, setShowPreferences] = useState(false);
  
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const departureCityInputRef = useRef<HTMLInputElement>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  
  // Calculate cost based on current duration preference using the new hook
  const days = parseInt(preferences.duration, 10) || 1;
  const { cost: estimatedCost, canAfford, formattedCost, userCredits, formattedUserCredits, formattedShortfall } = useItineraryCosts(days);

  useEffect(() => {
    const handleApiReady = () => setIsApiLoaded(true);

    if ((window as any).google?.maps?.places) {
      handleApiReady();
    } else {
      window.addEventListener('google-maps-api-ready', handleApiReady, { once: true });
    }
    
    return () => window.removeEventListener('google-maps-api-ready', handleApiReady);
  }, []);

  useEffect(() => {
    if (!isApiLoaded) return;
    
    const setupAutocomplete = (inputRef: React.RefObject<HTMLInputElement>, field: 'destination' | 'departureCity') => {
        const input = inputRef.current;
        if (!input) return;

        const autocomplete = new (window as any).google.maps.places.Autocomplete(input, {
            types: ['(cities)'],
            fields: ['formatted_address', 'name']
        });
        
        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place && (place.formatted_address || place.name)) {
                setPlace(field, place.formatted_address || place.name);
            }
        });

        return () => {
             (window as any).google.maps.event.removeListener(listener);
             if (input) {
                (window as any).google.maps.event.clearInstanceListeners(input);
             }
        };
    };

    const cleanupDest = setupAutocomplete(destinationInputRef, 'destination');
    let cleanupDep: (() => void) | undefined;
    if (showPreferences && departureCityInputRef.current) {
        cleanupDep = setupAutocomplete(departureCityInputRef, 'departureCity');
    }
    
    return () => {
        if (cleanupDest) cleanupDest();
        if (cleanupDep) cleanupDep();
    };
  }, [isApiLoaded, setPlace, showPreferences]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan();
  };
  
  const handleClear = () => {
    resetPreferences();
    if(destinationInputRef.current) destinationInputRef.current.value = '';
    if(departureCityInputRef.current) departureCityInputRef.current.value = '';
  }

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreference(name as any, value);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2">
        {/* Top bar with toggle and itinerary button */}
        <div className="flex items-center justify-center gap-2 bg-gray-900/60 backdrop-blur-md p-1 rounded-full shadow-lg border border-white/10">
            <div className="flex items-center gap-1.5 text-white px-1.5">
                <span className="text-xs font-medium">Agent Mode</span>
                <button
                    onClick={() => setPlannerMode(!isPlannerMode)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isPlannerMode ? 'bg-indigo-500' : 'bg-gray-600'
                    }`}
                >
                    <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        isPlannerMode ? 'translate-x-5' : 'translate-x-1'
                    }`}
                    />
                </button>
            </div>
            {itineraryGenerated && (
                <>
                <div className="w-px h-4 bg-white/20" />
                <button 
                    onClick={onViewItinerary}
                    className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold py-1 px-2.5 rounded-full flex items-center gap-1 hover:from-indigo-600 hover:to-pink-600 transition-all text-xs shadow-md"
                >
                    <Icon name="itinerary" className="w-4 h-4"/>
                    View
                </button>
                <button onClick={onReset} className="p-1.5 bg-gray-600/50 rounded-full text-white hover:bg-gray-500/50 transition-colors" aria-label="Reset and start new search">
                    <Icon name="refresh" className="w-4 h-4" />
                </button>
                </>
            )}
        </div>

        {/* Search/Form Area */}
        <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-lg p-3 rounded-xl shadow-2xl transition-all duration-300 border border-white/10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon name="search" className="w-4 h-4 text-indigo-400" />
                    </div>
                    <input
                        ref={destinationInputRef}
                        type="text"
                        name="destination"
                        defaultValue={preferences.destination}
                        onChange={handlePreferencesChange}
                        placeholder={isPlannerMode ? "Where to next? ✈️" : "Explore places, history..."}
                        className="w-full bg-slate-700/50 border border-white/10 rounded-lg pl-10 pr-20 py-2.5 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        autoComplete="off"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        {isPlannerMode && (
                            <button
                                type="button"
                                onClick={() => setShowPreferences(!showPreferences)}
                                aria-label="Toggle planner preferences"
                                className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                                    showPreferences 
                                        ? 'bg-indigo-500 text-white shadow-md' 
                                        : 'text-gray-400 hover:bg-slate-600/50 hover:text-indigo-400'
                                }`}
                            >
                                <Icon name="filters" className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading || !canAfford}
                            className={`rounded-lg p-1.5 transition-all disabled:cursor-not-allowed flex-shrink-0 shadow-md ${
                              !canAfford 
                                ? 'bg-gray-600 text-gray-400' 
                                : 'bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white disabled:opacity-50'
                            }`}
                            aria-label="Generate Itinerary"
                            title={!canAfford ? `Need ${formattedCost} (You have ${formattedUserCredits})` : `Generate itinerary for ${formattedCost}`}
                        >
                           {isLoading ? (
                             <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                           ) : (
                             <Icon name="arrow-right" className="w-4 h-4" />
                           )}
                        </button>
                    </div>
                </div>
            </form>

            {isPlannerMode && showPreferences && (
                <div className="mt-3 p-3 bg-gradient-to-br from-slate-900/80 to-indigo-900/40 rounded-lg border border-white/10">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-indigo-300 mb-1">
                                <Icon name="plane" className="w-3 h-3" />
                                Departure City
                            </label>
                            <input
                                ref={departureCityInputRef}
                                type="text"
                                name="departureCity"
                                defaultValue={preferences.departureCity}
                                onChange={handlePreferencesChange}
                                placeholder="e.g., 'New York City'"
                                className="w-full p-2 text-xs bg-slate-700/60 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent transition-all"
                            />
                        </div>
                        
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-amber-300 mb-1">
                                <Icon name="calendar" className="w-3 h-3" />
                                Duration
                            </label>
                            <input 
                                type="number" 
                                name="duration" 
                                min="1" 
                                value={preferences.duration} 
                                onChange={handlePreferencesChange} 
                                className="w-full p-2 text-xs bg-slate-700/60 border border-white/20 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-transparent transition-all" 
                            />
                            <div className={`mt-1 text-xs flex items-center gap-1 ${canAfford ? 'text-amber-400' : 'text-red-400'}`}>
                                <Icon name="coin" className="w-3 h-3" />
                                Cost: {formattedCost}
                                {!canAfford && (
                                    <span className="text-red-300 ml-1">(Need {formattedShortfall} more)</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-emerald-300 mb-1">
                                <Icon name="calendar" className="w-3 h-3" />
                                Start Date
                            </label>
                            <input 
                                type="date" 
                                name="startDate" 
                                value={preferences.startDate} 
                                onChange={handlePreferencesChange} 
                                className="w-full p-2 text-xs bg-slate-700/60 border border-white/20 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-transparent transition-all" 
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-pink-300 mb-1">
                                <Icon name="clock" className="w-3 h-3" />
                                Pace
                            </label>
                            <select 
                                name="pace" 
                                value={preferences.pace} 
                                onChange={handlePreferencesChange} 
                                className="w-full p-2 text-xs bg-slate-700/60 border border-white/20 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-transparent transition-all"
                            >
                                <option>Relaxed</option>
                                <option>Moderate</option>
                                <option>Packed</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-purple-300 mb-1">
                                <Icon name="users" className="w-3 h-3" />
                                Group
                            </label>
                            <select 
                                name="group" 
                                value={preferences.group} 
                                onChange={handlePreferencesChange} 
                                className="w-full p-2 text-xs bg-slate-700/60 border border-white/20 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent transition-all"
                            >
                                <option>Solo</option>
                                <option>Couple</option>
                                <option>Family</option>
                                <option>Friends</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-cyan-300 mb-1">
                                <Icon name="star" className="w-3 h-3" />
                                Interests / Vibe
                            </label>
                            <input
                                type="text"
                                name="interests"
                                value={preferences.interests}
                                onChange={handlePreferencesChange}
                                placeholder="e.g., 'Adventure, hiking, street food'"
                                className="w-full p-2 text-xs bg-slate-700/60 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-amber-300 mb-1">
                                <Icon name="coin" className="w-3 h-3" />
                                Budget
                            </label>
                            <input
                                type="text"
                                name="budget"
                                value={preferences.budget}
                                onChange={handlePreferencesChange}
                                placeholder="e.g., '$1500', '€2000', 'Budget-friendly'"
                                className="w-full p-2 text-xs bg-slate-700/60 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center gap-2">
                        <button 
                            type="button" 
                            onClick={handleClear} 
                            className="flex items-center gap-1.5 text-gray-300 hover:text-white font-medium px-3 py-1.5 text-xs rounded-md hover:bg-slate-600/50 transition-all"
                        >
                            <Icon name="refresh" className="w-3 h-3" />
                            Clear
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setShowPreferences(false)} 
                            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-medium px-4 py-1.5 text-xs rounded-md transition-all shadow-md"
                        >
                            <Icon name="check" className="w-3 h-3" />
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default PlannerControls;
