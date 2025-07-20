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
            fillColor: getActivityColor(activity.category?.toLowerCase() || 'other').replace('bg-', '#').replace('-500', ''),
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
      <div className="w-96 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 relative">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBackClick}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Icon name="arrow-left" className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Icon name="share" className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Icon name="more-horizontal" className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
            <div className="relative bg-cover bg-center h-32 rounded-lg flex items-end p-4" 
                 style={{
                   backgroundImage: actualItinerary[0]?.imageUrl ? 
                     `url(${actualItinerary[0].imageUrl})` : 
                     'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                 }}>
              <div>
                <h1 className="text-xl font-bold text-white mb-1">
                  {processedItinerary.duration} {processedItinerary.destination} itinerary
                </h1>
                <div className="flex items-center space-x-4 text-sm text-white/90">
                  <span>{processedItinerary.duration}</span>
                  <span>•</span>
                  <span>{processedItinerary.totalAttractions} attractions</span>
                  <span>•</span>
                  <span>{processedItinerary.categories.join(' • ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Description */}
        <div className="p-4 border-b border-gray-200">
          <div className="text-sm text-gray-600 leading-relaxed">
            Explore the beautiful {processedItinerary.destination} over {processedItinerary.duration} with {processedItinerary.totalAttractions} carefully curated attractions. Experience the perfect blend of {processedItinerary.categories.join(', ')} activities tailored for {processedItinerary.group.toLowerCase()} travelers.
          </div>
        </div>

        {/* Day Tabs */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="tabs-container relative flex justify-center">
            <div className="tabs-wrapper relative flex bg-white rounded-full p-1 shadow-lg border border-gray-200">
              {processedItinerary.dayPlans.map((day: any, index: number) => (
                <React.Fragment key={day.day}>
                  <input 
                    type="radio" 
                    id={`day-${day.day}`} 
                    name="day-tabs" 
                    checked={selectedDay === day.day}
                    onChange={() => setSelectedDay(day.day)}
                    className="hidden"
                  />
                  <label 
                    htmlFor={`day-${day.day}`}
                    className="tab relative flex items-center justify-center h-10 px-4 min-w-16 text-sm font-medium cursor-pointer transition-colors duration-300 rounded-full z-10"
                    style={{
                      color: selectedDay === day.day ? '#185ee0' : '#6b7280'
                    }}
                  >
                    Day {day.day}
                    {day.activities.length > 0 && (
                      <span className={`ml-2 flex items-center justify-center w-5 h-5 text-xs rounded-full transition-colors duration-300 ${
                        selectedDay === day.day 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {day.activities.length}
                      </span>
                    )}
                  </label>
                </React.Fragment>
              ))}
              
              {/* Animated glider */}
              <span 
                className="glider absolute h-10 bg-blue-50 rounded-full transition-transform duration-300 ease-out z-0"
                style={{
                  width: `${100 / processedItinerary.dayPlans.length}%`,
                  transform: `translateX(${((selectedDay - 1) * 100)}%)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Day Activities List */}
        <div className="flex-1 overflow-y-auto">
          {selectedDayData && (
            <div className="p-4 space-y-4">
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
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                  
                  {/* Main card */}
                  <div className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:border-blue-200">
                    <div className="flex space-x-4">
                      {/* Activity Image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {activity.imageUrl ? (
                          <img 
                            src={activity.imageUrl} 
                            alt={activity.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = 
                                `<div class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl">${getActivityIcon(activity.category?.toLowerCase() || 'other')}</div>`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
                            {getActivityIcon(activity.category?.toLowerCase() || 'other')}
                          </div>
                        )}
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C13.5 2 15 3 15.5 4.5L14.7 4.9C14.4 4.4 13.7 4 13 4C12 4 11.2 4.7 11 5.6L12.4 6.3C12.5 6.1 12.7 6 13 6C13.3 6 13.5 6.1 13.6 6.3L15 5.6C14.8 4.7 14 4 13 4C12.3 4 11.6 4.4 11.3 4.9L10.5 4.5C11 3 12.5 2 12 2M8.5 5C9.3 5 10 5.7 10 6.5S9.3 8 8.5 8 7 7.3 7 6.5 7.7 5 8.5 5M15.5 5C16.3 5 17 5.7 17 6.5S16.3 8 15.5 8 14 7.3 14 6.5 14.7 5 15.5 5Z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Activity Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-lg">
                            {activity.title}
                          </h3>
                          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                            <Icon name="more-horizontal" className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.category?.toLowerCase() || 'other')} text-white`}>
                            {activity.category}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{activity.duration}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Icon name="clock" className="w-4 h-4" />
                              <span>{activity.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Icon name="map-pin" className="w-4 h-4" />
                              <span>GPS</span>
                            </div>
                          </div>
                          
                          {activity.rating && (
                            <div className="flex items-center space-x-1">
                              <Icon name="star" className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium text-gray-700">{activity.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Local Tip with beautiful styling */}
                    {activity.localTip && (
                      <div className="mt-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur"></div>
                        <div className="relative bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl p-3">
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Icon name="lightbulb" className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-sm text-yellow-800 leading-relaxed">
                              <span className="font-medium">Local Tip:</span> {activity.localTip.substring(0, 120)}
                              {activity.localTip.length > 120 && '...'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hover indicator */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
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
            
            {/* Preferences Card */}
            {preferences && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl min-w-64 max-w-80">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                    <h3 className="font-semibold text-white text-sm">Trip Preferences</h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">From:</span>
                      <span className="font-medium text-white">{preferences.departureCity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Duration:</span>
                      <span className="font-medium text-white">{preferences.duration} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Group:</span>
                      <span className="font-medium text-white">{preferences.group}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Pace:</span>
                      <span className="font-medium text-white">{preferences.pace}</span>
                    </div>
                    {preferences.budget && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Budget:</span>
                        <span className="font-medium text-emerald-400">${preferences.budget}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Weather Card - UIVERSE Inspired */}
            {weatherForecast.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative weather-card bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl overflow-hidden shadow-xl min-w-72">
                  
                  {/* Background Design */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-12 w-32 h-32 bg-yellow-400 rounded-full opacity-40"></div>
                    <div className="absolute -top-16 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-40"></div>
                    <div className="absolute -top-6 -right-2 w-12 h-12 bg-yellow-300 rounded-full opacity-100"></div>
                  </div>
                  
                  {/* Main Info Section */}
                  <div className="relative flex items-center justify-between p-4 text-white">
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24">
                          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                        </svg>
                        <span className="text-sm font-medium">Sunny</span>
                      </div>
                      <div className="text-4xl font-bold mb-1">{weatherForecast[0]?.highTemp || '25'}°</div>
                      <div className="text-sm opacity-90">{weatherForecast[0]?.highTemp || '25'}°/{weatherForecast[0]?.lowTemp || '18'}°</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-semibold">Day {selectedDay}</div>
                      <div className="text-sm opacity-90">{processedItinerary.destination}</div>
                    </div>
                  </div>
                  
                  {/* Days Section */}
                  <div className="flex bg-black/20 border-t border-white/20">
                    {weatherForecast.slice(0, 4).map((weather: any, index: number) => (
                      <button 
                        key={index}
                        className="flex-1 flex flex-col items-center justify-center p-2 hover:bg-white/10 transition-colors text-white text-xs gap-1"
                        onClick={() => setSelectedDay(weather.day)}
                      >
                        <span className="font-medium opacity-70">
                          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][index] || `D${weather.day}`}
                        </span>
                        <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"/>
                        </svg>
                        <span className="font-bold">{weather.highTemp}°</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Flight Options Card */}
            {flightOptions.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl min-w-64 max-w-80">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                    <h3 className="font-semibold text-white text-sm">Flight Options</h3>
                  </div>
                  <div className="space-y-3">
                    {flightOptions.slice(0, 2).map((flight: any, index: number) => (
                      <div key={index} className="bg-white/10 rounded-xl p-3 border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white text-sm">{flight.airline}</span>
                          <span className="font-bold text-emerald-400 text-sm">${flight.price}</span>
                        </div>
                        <div className="text-white/70 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Departure:</span>
                            <span className="font-medium">{flight.departureTime}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Duration:</span>
                            <span className="font-medium">{flight.duration}</span>
                          </div>
                        </div>
                        {flight.bookingUrl && (
                          <button 
                            onClick={() => window.open(flight.bookingUrl, '_blank')}
                            className="w-full mt-2 bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-400 text-xs py-2 px-3 rounded-lg transition-colors border border-emerald-400/30 font-medium"
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trip Summary Overlay - Enhanced */}
        <div className="absolute bottom-4 left-4">
          <div className="relative group">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur"></div>
            
            {/* Main card */}
            <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">Trip Summary</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/70">Day {selectedDay}</span>
                </div>
              </div>
              
              {selectedDayData && (
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Activities:</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-white text-lg">{selectedDayData.activities.length}</span>
                      <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center">
                        <span className="text-xs text-purple-300">📍</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Duration:</span>
                    <span className="font-bold text-white text-lg">{selectedDayData.totalDuration}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Area:</span>
                    <span className="font-medium text-white text-sm truncate ml-2 max-w-32" title={selectedDayData.fullLocation}>
                      {selectedDayData.fullLocation}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-xs">Trip Progress</span>
                      <span className="text-white/70 text-xs">{Math.round((selectedDay / processedItinerary.totalDays) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(selectedDay / processedItinerary.totalDays) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Discover Button - UIVERSE Inspired */}
              <button className="discover-button w-full flex items-center justify-center px-6 py-3 bg-blue-600 border-4 border-blue-200 text-white gap-3 rounded-full cursor-pointer transition-all duration-300 hover:border-blue-100 hover:bg-blue-700 active:border-2 group/btn">
                <span className="text-lg font-bold tracking-wider">Explore</span>
                <div className="svg-container">
                  <svg className="w-8 h-5 group-hover/btn:animate-pulse" fill="white" viewBox="0 0 38 15">
                    <path d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}