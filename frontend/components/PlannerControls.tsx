"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './common/Icon';
import { usePreferencesStore } from '../store/preferencesStore';
import { useUIStore } from '../store/uiStore';

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
                <span className="text-xs font-medium">Day Mode</span>
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
        <div className="w-full bg-slate-800/50 backdrop-blur-lg p-1 rounded-xl shadow-2xl transition-all duration-300 border border-white/10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                    <Icon name="search" className="w-4 h-4 text-gray-400 ml-2" />
                    <input
                        ref={destinationInputRef}
                        type="text"
                        name="destination"
                        defaultValue={preferences.destination}
                        onChange={handlePreferencesChange}
                        placeholder={isPlannerMode ? "Enter destination..." : "Explore places, history..."}
                        className="w-full bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none py-1.5"
                        autoComplete="off"
                    />
                     {isPlannerMode && (
                        <button
                            type="button"
                            onClick={() => setShowPreferences(!showPreferences)}
                            aria-label="Toggle planner preferences"
                            className="text-gray-400 p-2 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
                        >
                            <Icon name="filters" className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gray-900 text-white rounded-lg p-2 hover:bg-gray-700 transition-colors disabled:bg-gray-500 flex-shrink-0"
                        aria-label="Generate Itinerary"
                    >
                       {isLoading ? (
                         <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                       ) : (
                         <Icon name="arrow-right" className="w-4 h-4" />
                       )}
                    </button>
                </div>
            </form>

            {isPlannerMode && showPreferences && (
            <div className="px-1.5 pb-1.5 pt-0.5 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-400">Departure City</label>
                      <input
                          ref={departureCityInputRef}
                          type="text"
                          name="departureCity"
                          defaultValue={preferences.departureCity}
                          onChange={handlePreferencesChange}
                          placeholder="e.g., 'New York City'"
                          className="w-full p-1.5 text-sm bg-slate-700/50 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                    </div>
                    
                    <div>
                        <label className="text-xs text-gray-400">Duration (days)</label>
                        <input type="number" name="duration" min="1" value={preferences.duration} onChange={handlePreferencesChange} className="w-full p-1.5 text-sm bg-slate-700/50 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="text-xs text-gray-400">Start Date</label>
                        <input type="date" name="startDate" value={preferences.startDate} onChange={handlePreferencesChange} className="w-full p-1.5 text-sm bg-slate-700/50 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="text-xs text-gray-400">Pace</label>
                        <select name="pace" value={preferences.pace} onChange={handlePreferencesChange} className="w-full p-1.5 text-sm bg-slate-700/50 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Relaxed</option>
                            <option>Moderate</option>
                            <option>Packed</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-gray-400">Group</label>
                        <select name="group" value={preferences.group} onChange={handlePreferencesChange} className="w-full p-1.5 text-sm bg-slate-700/50 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Solo</option>
                            <option>Couple</option>
                            <option>Family</option>
                            <option>Friends</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                         <label className="text-xs text-gray-400">Interests / Vibe</label>
                        <input
                            type="text"
                            name="interests"
                            value={preferences.interests}
                            onChange={handlePreferencesChange}
                            placeholder="e.g., 'Adventure, hiking, street food'"
                            className="w-full p-1.5 text-sm bg-slate-700/50 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                    </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                    <button type="button" onClick={handleClear} className="text-gray-300 font-semibold px-3 py-1.5 text-sm rounded-md hover:bg-white/10">Clear</button>
                    <button type="button" onClick={() => setShowPreferences(false)} className="bg-indigo-600 text-white font-semibold px-4 py-1.5 text-sm rounded-md hover:bg-indigo-700 transition-colors">
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
