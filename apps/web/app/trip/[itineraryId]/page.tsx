'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { Icon } from '../../../components/common/Icon';

// Google Maps integration
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const itineraryId = params.itineraryId as string;
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  
  // Query for the specific search history item
  const searchItem = useQuery(api.queries.getSearchHistoryById, { 
    searchHistoryId: itineraryId as any
  });
  
  // Extract itinerary data from the search item
  const itineraryData = searchItem?.itinerary;
  const actualItinerary = itineraryData?.itinerary || [];
  const preferences = searchItem?.preferences;
  const weatherForecast = itineraryData?.weatherForecast || [];
  const flightOptions = itineraryData?.flightOptions || [];

  // Process the real itinerary data into day plans
  const processedItinerary = React.useMemo(() => {
    if (!actualItinerary.length || !preferences) {
      return null;
    }

    // Group activities by day
    const dayGroups: { [key: number]: any[] } = {};
    actualItinerary.forEach((activity: any) => {
      if (!dayGroups[activity.day]) {
        dayGroups[activity.day] = [];
      }
      dayGroups[activity.day].push(activity);
    });

    // Create day plans
    const dayPlans = Object.keys(dayGroups).map(dayStr => {
      const day = parseInt(dayStr);
      const activities = dayGroups[day];
      
      // Get unique locations for this day
      const locations = [...new Set(activities.map(a => a.title?.split(' at ')[1] || a.title))];
      const mainLocation = locations[0] || `Day ${day}`;
      
      return {
        day,
        location: mainLocation.length > 20 ? mainLocation.substring(0, 20) + '...' : mainLocation,
        fullLocation: mainLocation,
        type: `${activities.length} attractions`,
        activities: activities.map(activity => ({
          ...activity,
          time: activity.startTime || '10:00 AM',
          duration: `${activity.durationHours || 2} hrs`,
          type: activity.category?.toLowerCase() || 'other'
        })),
        totalDuration: activities.reduce((sum, a) => sum + (a.durationHours || 2), 0)
      };
    });

    const destination = preferences.destination.split(',')[0] || 'Unknown Destination';
    const duration = parseInt(preferences.duration) || 5;

    return {
      destination,
      departDate: preferences.startDate ? new Date(preferences.startDate).toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) : 'Date TBD',
      returnDate: preferences.startDate && preferences.duration ? new Date(
        new Date(preferences.startDate).getTime() + (duration * 24 * 60 * 60 * 1000)
      ).toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) : 'Date TBD',
      duration: `${duration} days`,
      totalDays: duration,
      totalAttractions: actualItinerary.length,
      dayPlans: dayPlans.sort((a, b) => a.day - b.day),
      budget: preferences.budget || 'Budget TBD',
      group: preferences.group || 'Solo',
      pace: preferences.pace || 'Moderate',
      categories: [...new Set(actualItinerary.map((a: any) => a.category))].slice(0, 3)
    };
  }, [actualItinerary, preferences]);

  const handleBackClick = () => {
    router.back();
  };

  // Initialize Google Maps
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google && processedItinerary) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else if (window.google && processedItinerary) {
      initializeMap();
    }
  }, [processedItinerary]);

  // Update map when selected day changes
  useEffect(() => {
    if (map && processedItinerary) {
      updateMarkersForDay();
      drawDayRoute();
    }
  }, [selectedDay, map, processedItinerary]);

  const initializeMap = () => {
    if (!window.google || !actualItinerary.length) return;

    const mapElement = document.getElementById('google-map');
    if (!mapElement) return;

    // Calculate center point from all coordinates
    const coordinates = actualItinerary.filter((item: any) => item.latitude && item.longitude);
    if (coordinates.length === 0) return;

    const centerLat = coordinates.reduce((sum: number, item: any) => sum + item.latitude, 0) / coordinates.length;
    const centerLng = coordinates.reduce((sum: number, item: any) => sum + item.longitude, 0) / coordinates.length;

    const mapInstance = new window.google.maps.Map(mapElement, {
      center: { lat: centerLat, lng: centerLng },
      zoom: 12,
      styles: [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
        }
      ]
    });

    setMap(mapInstance);

    // Create markers for each activity
    const newMarkers: any[] = [];

    actualItinerary.forEach((activity: any, index: number) => {
      if (activity.latitude && activity.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: activity.latitude, lng: activity.longitude },
          map: mapInstance,
          title: activity.title,
          label: {
            text: activity.day.toString(),
            color: 'white',
            fontWeight: 'bold'
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 20,
            fillColor: getActivityColorHex(activity.category?.toLowerCase() || 'other'),
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2
          },
          visible: activity.day === selectedDay // Only show markers for selected day initially
        });

        // Store day info with marker for filtering
        (marker as any).activityDay = activity.day;

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-bold text-gray-900 mb-1">${activity.title}</h3>
              <p class="text-sm text-gray-600 mb-2">${activity.description?.substring(0, 100)}...</p>
              <div class="flex items-center justify-between text-xs">
                <span class="text-green-600 font-medium">${activity.startTime}</span>
                <span class="text-gray-500">${activity.durationHours}h</span>
                <span class="text-yellow-600">⭐ ${activity.rating}</span>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
          setSelectedDay(activity.day);
        });

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);
    
    // Initial focus on day 1
    updateMarkersForDay();
  };

  const updateMarkersForDay = () => {
    if (!markers.length) return;

    // Show/hide markers based on selected day
    markers.forEach((marker: any) => {
      const isVisible = marker.activityDay === selectedDay;
      marker.setVisible(isVisible);
    });

    // Focus map on selected day's activities
    const dayActivities = actualItinerary.filter((activity: any) => 
      activity.day === selectedDay && activity.latitude && activity.longitude
    );

    if (dayActivities.length > 0) {
      const dayBounds = new window.google.maps.LatLngBounds();
      dayActivities.forEach((activity: any) => {
        dayBounds.extend({ lat: activity.latitude, lng: activity.longitude });
      });
      map.fitBounds(dayBounds);
    }
  };

  const drawDayRoute = () => {
    if (!map || !processedItinerary) return;

    // Clear existing route
    if ((window as any).currentDirectionsRenderer) {
      (window as any).currentDirectionsRenderer.setMap(null);
    }

    // Get activities for the selected day
    const dayActivities = actualItinerary.filter((activity: any) => 
      activity.day === selectedDay && activity.latitude && activity.longitude
    );

    if (dayActivities.length < 2) return;

    // Draw route for selected day only
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3B82F6',
        strokeWeight: 3,
        strokeOpacity: 0.8
      }
    });
    directionsRenderer.setMap(map);

    // Store renderer to clear later
    (window as any).currentDirectionsRenderer = directionsRenderer;

    // Create waypoints for the day's route
    const waypoints = dayActivities.slice(1, -1).map((activity: any) => ({
      location: { lat: activity.latitude, lng: activity.longitude },
      stopover: true
    }));

    directionsService.route({
      origin: { lat: dayActivities[0].latitude, lng: dayActivities[0].longitude },
      destination: { lat: dayActivities[dayActivities.length - 1].latitude, lng: dayActivities[dayActivities.length - 1].longitude },
      waypoints: waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING
    }, (result: any, status: any) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
      }
    });

    // Focus map on selected day's activities
    const dayBounds = new window.google.maps.LatLngBounds();
    dayActivities.forEach((activity: any) => {
      dayBounds.extend({ lat: activity.latitude, lng: activity.longitude });
    });
    map.fitBounds(dayBounds);
  };

  const getActivityIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      outdoor: '🏖️',
      food: '🍽️',
      culture: '🏛️',
      entertainment: '🎭',
      shopping: '🛍️',
      other: '📍'
    };
    return icons[category] || '📍';
  };

  const getActivityColor = (category: string) => {
    const colors: { [key: string]: string } = {
      outdoor: 'bg-blue-500',
      food: 'bg-orange-500', 
      culture: 'bg-purple-500',
      entertainment: 'bg-pink-500',
      shopping: 'bg-green-500',
      other: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getActivityColorHex = (category: string) => {
    const colorMap: { [key: string]: string } = {
      outdoor: '#3B82F6',      // blue-500
      food: '#F97316',         // orange-500  
      culture: '#A855F7',      // purple-500
      entertainment: '#EC4899', // pink-500
      shopping: '#10B981',     // green-500
      other: '#6B7280'         // gray-500
    };
    return colorMap[category] || '#6B7280';
  };

  // Show loading state
  if (searchItem === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show not found state
  if (searchItem === null || !processedItinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
          <p className="text-gray-600 mb-4">The itinerary you're looking for doesn't exist.</p>
          <button
            onClick={handleBackClick}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const selectedDayData = processedItinerary.dayPlans.find((d: any) => d.day === selectedDay);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Left Sidebar Panel */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Header with Hero Image */}
        <div className="relative h-48 overflow-hidden">
          {/* Hero Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: actualItinerary[0]?.imageUrl ? 
                `url(${actualItinerary[0].imageUrl})` : 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"></div>
          </div>
          
          {/* Back Button - Top Left */}
          <button
            onClick={handleBackClick}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors z-10"
          >
            <Icon name="arrow-left" className="w-5 h-5 text-white" />
          </button>
          
          {/* Trip Title - Bottom */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-xl font-bold text-white mb-1">
              {processedItinerary.destination}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-white/90">
              <span>{processedItinerary.duration}</span>
              <span>•</span>
              <span>{processedItinerary.totalAttractions} attractions</span>
            </div>
          </div>
        </div>

        {/* Trip Description */}
        <div className="p-3 border-b border-gray-200">
          <div className="text-xs text-gray-600 leading-relaxed">
            Explore {processedItinerary.destination} with {processedItinerary.totalAttractions} curated attractions. Perfect blend of {processedItinerary.categories.slice(0, 2).join(', ')} activities.
          </div>
        </div>

        {/* Day Tabs - Scrollable with Global CSS Colors */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 min-w-max">
              {processedItinerary.dayPlans.map((day: any, index: number) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`flex-shrink-0 flex items-center px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedDay === day.day
                      ? 'text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{
                    background: selectedDay === day.day 
                      ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' 
                      : undefined
                  }}
                >
                  Day {day.day}
                  {day.activities.length > 0 && (
                    <span className={`ml-1 flex items-center justify-center w-4 h-4 text-xs rounded-full ${
                      selectedDay === day.day 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {day.activities.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Day Activities List */}
        <div className="flex-1 overflow-y-auto">
          {selectedDayData && (
            <div className="p-3 space-y-3">
              {selectedDayData.activities.map((activity: any, index: number) => (
                <div 
                  key={index}
                  className="group relative cursor-pointer"
                  onClick={() => {
                    // Center map on this activity
                    if (map && activity.latitude && activity.longitude) {
                      map.panTo({ lat: activity.latitude, lng: activity.longitude });
                      map.setZoom(15);
                    }
                  }}
                >
                  {/* Main card - with image */}
                  <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.01] group-hover:border-blue-200">
                    
                    {/* Activity Image */}
                    {activity.imageUrl && (
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={activity.imageUrl}
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Hide image if it fails to load
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* Activity Icon Overlay */}
                        <div className="absolute top-2 left-2">
                          <div className={`w-8 h-8 rounded-lg ${getActivityColor(activity.category?.toLowerCase() || 'other')} flex items-center justify-center shadow-md`}>
                            <span className="text-sm">{getActivityIcon(activity.category?.toLowerCase() || 'other')}</span>
                          </div>
                        </div>
                        
                        {/* Rating Overlay */}
                        {activity.rating && (
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                            <div className="flex items-center space-x-1">
                              <Icon name="star" className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs font-medium text-white">{activity.rating}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
                          {activity.title}
                        </h3>
                        {!activity.imageUrl && activity.rating && (
                          <div className="flex items-center space-x-1">
                            <Icon name="star" className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs font-medium text-gray-700">{activity.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Activity Icon when no image */}
                      {!activity.imageUrl && (
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-10 h-10 rounded-xl ${getActivityColor(activity.category?.toLowerCase() || 'other')} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <span className="text-lg">{getActivityIcon(activity.category?.toLowerCase() || 'other')}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.category?.toLowerCase() || 'other')} text-white`}>
                          {activity.category}
                        </span>
                        <span className="text-xs text-gray-500">{activity.duration}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Icon name="clock" className="w-3 h-3" />
                          <span>{activity.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="map-pin" className="w-3 h-3" />
                          <span>GPS</span>
                        </div>
                      </div>

                      {/* Description for cards with images */}
                      {activity.imageUrl && activity.description && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                            {activity.description.length > 100 
                              ? activity.description.substring(0, 100) + '...' 
                              : activity.description
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Local Tip - more compact */}
                    {activity.localTip && (
                      <div className="mt-2 bg-yellow-50 border-l-2 border-yellow-400 rounded-r-lg p-2">
                        <div className="flex items-start space-x-2">
                          <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon name="lightbulb" className="w-2 h-2 text-white" />
                          </div>
                          <p className="text-xs text-yellow-800 leading-relaxed">
                            <span className="font-medium">Tip:</span> {activity.localTip.substring(0, 80)}
                            {activity.localTip.length > 80 && '...'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hover indicator */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Map Panel */}
      <div className="flex-1 relative">
        {/* Map Container */}
        <div id="google-map" className="w-full h-full"></div>

        {/* Combined Info Panel - Top Horizontal */}
        <div className="absolute top-4 left-4 right-4">
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            
            {/* Preferences Card - Badge Style */}
            {preferences && (
              <div className="relative group">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 min-w-48">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-gray-800 text-xs">Trip Preferences</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {preferences.duration} days
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {preferences.group}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {preferences.pace}
                    </span>
                    {preferences.budget && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        ${preferences.budget}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Weather Card - Compact */}
            {weatherForecast.length > 0 && (
              <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl p-3 shadow-lg min-w-44">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"/>
                      </svg>
                      <span className="text-xs font-medium">Sunny</span>
                    </div>
                    <div className="text-lg font-bold">{weatherForecast[0]?.highTemp || '25'}°</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">Day {selectedDay}</div>
                    <div className="text-xs opacity-90">{weatherForecast[0]?.highTemp || '25'}°/{weatherForecast[0]?.lowTemp || '18'}°</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Flight Options Card - Badge Style */}
            {flightOptions.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 min-w-48">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-gray-800 text-xs">Flight Options</h3>
                </div>
                <div className="space-y-2">
                  {flightOptions.slice(0, 2).map((flight: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {flight.airline}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {flight.duration}
                        </span>
                      </div>
                      <span className="font-bold text-emerald-600 text-sm">${flight.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trip Summary Overlay - Compact */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg max-w-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm">Trip Summary</h3>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/70">Day {selectedDay}</span>
              </div>
            </div>
            
            {selectedDayData && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Activities:</span>
                  <span className="font-bold text-white text-sm">{selectedDayData.activities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Duration:</span>
                  <span className="font-bold text-white text-sm">{selectedDayData.totalDuration}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Area:</span>
                  <span className="font-medium text-white text-xs truncate ml-2 max-w-24" title={selectedDayData.fullLocation}>
                    {selectedDayData.fullLocation}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-xs">Progress</span>
                    <span className="text-white/70 text-xs">{Math.round((selectedDay / processedItinerary.totalDays) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(selectedDay / processedItinerary.totalDays) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}