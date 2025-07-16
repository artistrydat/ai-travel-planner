"use client";

import React from 'react';
import { Activity, DailyWeather, FlightOption } from '../types';
import { Icon } from './common/Icon';
import { useItineraryStore } from '../store/itineraryStore';
import { useUIStore } from '../store/uiStore';

const getCategoryIcon = (category: Activity['category']) => {
  switch (category) {
    case 'Food': return 'food';
    case 'Culture': return 'culture';
    case 'Entertainment': return 'entertainment';
    case 'Outdoor': return 'outdoor';
    case 'Shopping': return 'shopping';
    default: return 'map-pin';
  }
};

const getCategoryTheme = (category: Activity['category']) => {
  switch (category) {
    case 'Food': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' };
    case 'Culture': return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' };
    case 'Entertainment': return { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' };
    case 'Outdoor': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' };
    case 'Shopping': return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' };
    default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' };
  }
};

const getWeatherIcon = (condition: DailyWeather['condition']) => {
    switch (condition) {
        case 'Sunny': return 'sun';
        case 'Cloudy': return 'cloud';
        case 'Rainy': return 'cloud-rain';
        case 'Partly Cloudy': return 'cloud';
        default: return 'sun';
    }
};

const WeatherCard: React.FC<{ weather: DailyWeather }> = ({ weather }) => (
  <div className="flex flex-col items-center gap-1 bg-slate-800/80 p-3 rounded-lg border border-white/10 text-center flex-1">
    <p className="font-bold text-sm text-gray-300">Day {weather.day}</p>
    <Icon name={getWeatherIcon(weather.condition)} className="w-8 h-8 text-amber-400" />
    <p className="text-sm font-semibold text-white">{weather.condition}</p>
    <p className="text-xs text-gray-400">{weather.highTemp}° / {weather.lowTemp}°C</p>
  </div>
);

const FlightCard: React.FC<{ flight: FlightOption }> = ({ flight }) => (
  <a href={flight.bookingUrl} target="_blank" rel="noopener noreferrer" className="block bg-slate-800/80 p-4 rounded-lg border border-white/10 hover:bg-slate-700 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon name="airplane" className="w-6 h-6 text-indigo-400 -rotate-45" />
        <div>
          <p className="font-bold text-white">{flight.airline}</p>
          <p className="text-xs text-gray-400">{flight.departureTime} &rarr; {flight.arrivalTime}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-white">${flight.price}</p>
        <p className="text-xs text-gray-400">{flight.duration}</p>
      </div>
    </div>
  </a>
);

const ActivityCard: React.FC<{ activity: Activity, isFirst: boolean }> = ({ activity, isFirst }) => {
  const categoryTheme = getCategoryTheme(activity.category);

  return (
    <div className="flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className={`w-px flex-shrink-0 ${isFirst ? 'bg-transparent' : 'bg-white/10'}`} style={{height: '1.5rem'}}></div>
        <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center ${categoryTheme.bg} ring-8 ring-slate-900`}>
          <Icon name={getCategoryIcon(activity.category)} className={`w-5 h-5 ${categoryTheme.text}`} />
        </div>
        <div className="w-px bg-white/10 flex-grow"></div>
      </div>

      {/* Card Content */}
      <div className="pb-8 flex-grow">
        <div className={`bg-slate-800/80 p-4 rounded-xl border ${categoryTheme.border} shadow-lg relative -top-3`}>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="bg-indigo-500/20 text-indigo-300 text-sm font-semibold px-3 py-1 rounded-full">{activity.startTime}</span>
            <span className={`${categoryTheme.bg} ${categoryTheme.text} text-xs font-semibold px-3 py-1 rounded-full uppercase`}>{activity.category}</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Icon name="clock" className="w-4 h-4"/>
              {activity.durationHours} {activity.durationHours > 1 ? 'hours' : 'hour'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">{activity.title}</h3>
          <p className="text-gray-300 mt-1 mb-3">{activity.description}</p>
          
          {activity.localTip && (
             <div className="bg-amber-400/10 text-amber-200 border border-amber-400/20 p-3 rounded-lg flex gap-3 mt-3">
               <Icon name="tip" className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
               <div>
                 <h4 className="font-bold text-sm text-amber-300">Local Tip</h4>
                 <p className="text-sm">{activity.localTip}</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ItineraryView: React.FC = () => {
    const { itinerary } = useItineraryStore();
    const { isItineraryViewOpen, closeItinerary, openExportModal } = useUIStore();

    const activitiesByDay = React.useMemo(() => {
        if (!itinerary) return {};
        
        return itinerary.itinerary.reduce((acc: Record<string, Activity[]>, activity) => {
            const day = String(activity.day);
            (acc[day] = acc[day] || []).push(activity);
            return acc;
        }, {});
    }, [itinerary]);

    return (
        <div 
            className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-30 ${
                isItineraryViewOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-hidden={!isItineraryViewOpen}
            role="dialog"
            aria-modal="true"
            aria-labelledby="itinerary-title"
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500">
                          <Icon name="itinerary" className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white" id="itinerary-title">Trip Plan for:</h2>
                            <p className="text-gray-300">{itinerary?.destination}</p>
                        </div>
                    </div>
                    <button onClick={closeItinerary} className="p-2 rounded-full hover:bg-white/10" aria-label="Close itinerary view">
                        <Icon name="close" className="w-6 h-6 text-gray-300" />
                    </button>
                </header>

                {/* Content */}
                <main className="flex-grow overflow-y-auto p-4" tabIndex={isItineraryViewOpen ? 0 : -1}>
                    {itinerary ? (
                        <>
                            {/* Weather Section */}
                            {itinerary.weatherForecast && itinerary.weatherForecast.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-base font-bold text-gray-300 mb-2 px-1">Weather Forecast</h3>
                                    <div className="flex gap-2">
                                        {itinerary.weatherForecast.map(w => <WeatherCard key={w.day} weather={w} />)}
                                    </div>
                                </div>
                            )}

                            {/* Flight Options Section */}
                            {itinerary.flightOptions && itinerary.flightOptions.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-base font-bold text-gray-300 mb-2 px-1">Sample Flight Options</h3>
                                    <div className="space-y-2">
                                        {itinerary.flightOptions.map((f, i) => <FlightCard key={i} flight={f} />)}
                                    </div>
                                </div>
                            )}
                            
                            <div className="w-full h-px bg-white/10 my-6" />

                            {activitiesByDay && Object.keys(activitiesByDay).length > 0 ? (
                                Object.entries(activitiesByDay).map(([day, activities]) => (
                                    <div key={day} className="mb-8">
                                        <h3 className="text-lg font-bold text-gray-300 bg-slate-900/80 py-2 px-4 rounded-lg sticky top-0 z-10 -mx-4 px-4 backdrop-blur-sm">Day {day}</h3>
                                        <div className="mt-4">
                                            {activities.map((activity, index) => (
                                                <ActivityCard key={`${day}-${index}`} activity={activity} isFirst={index === 0} />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 py-4">No daily activities were generated.</p>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                            <Icon name="itinerary" className="w-16 h-16 text-gray-700 mb-4" />
                            <h3 className="text-lg font-semibold">No Itinerary to Display</h3>
                            <p className="text-sm">Generate a plan to see your trip here!</p>
                        </div>
                    )}
                </main>

                {/* Footer */}
                {itinerary && (
                    <footer className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/10 flex-shrink-0">
                        <button 
                            onClick={openExportModal}
                            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500"
                        >
                           <Icon name="download" className="w-5 h-5"/>
                           Export Plan
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default ItineraryView;
