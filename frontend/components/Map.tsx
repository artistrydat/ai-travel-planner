"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useItineraryStore } from '../store/itineraryStore';
import { useUIStore } from '../store/uiStore';

const Map: React.FC = () => {
    const { itinerary } = useItineraryStore();
    const { selectedActivityIndex, setSelectedActivityIndex } = useUIStore();
    
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any | null>(null);
    const markersRef = useRef<any[]>([]);
    const [isApiLoaded, setIsApiLoaded] = useState(false);

    // Wait for the Google Maps API to be ready using our custom event
    useEffect(() => {
        const handleApiReady = () => setIsApiLoaded(true);
        
        if ((window as any).google?.maps) {
            handleApiReady();
        } else {
            window.addEventListener('google-maps-api-ready', handleApiReady, { once: true });
        }

        return () => window.removeEventListener('google-maps-api-ready', handleApiReady);
    }, []);

    // Initialize map
    useEffect(() => {
        if (!isApiLoaded || !mapRef.current || mapInstance.current) return;
        
        // This Map ID is configured for the dark theme style in Google Cloud Console.
        const mapId = '2c61c7a0a3c1aad4916b31a1';

        mapInstance.current = new (window as any).google.maps.Map(mapRef.current, {
            center: { lat: 24.7136, lng: 46.6753 }, // Default to Riyadh
            zoom: 5,
            disableDefaultUI: true,
            mapId: mapId,
        });
    }, [isApiLoaded]);
    
    // Update markers when itinerary changes
    useEffect(() => {
        if (!mapInstance.current || !isApiLoaded) return;

        markersRef.current.forEach(marker => marker.map = null);
        markersRef.current = [];

        if (!itinerary || itinerary.itinerary.length === 0) {
            // Optionally reset map view when itinerary is cleared
            mapInstance.current.setCenter({ lat: 24.7136, lng: 46.6753 });
            mapInstance.current.setZoom(5);
            return;
        }

        const bounds = new (window as any).google.maps.LatLngBounds();
        
        itinerary.itinerary.forEach((activity, index) => {
            const position = { lat: activity.latitude, lng: activity.longitude };
            
            const marker = new (window as any).google.maps.marker.AdvancedMarkerElement({
                map: mapInstance.current,
                position: position,
                title: `Day ${activity.day}: ${activity.title}`,
            });

            marker.addListener('click', () => {
                setSelectedActivityIndex(index);
            });
            
            markersRef.current.push(marker);
            bounds.extend(position);
        });

        if (itinerary.itinerary.length > 1) {
            mapInstance.current.fitBounds(bounds, {top: 50, bottom: 250, left: 50, right: 50});
        } else {
            mapInstance.current.setCenter(bounds.getCenter());
            mapInstance.current.setZoom(14);
        }
    }, [itinerary, isApiLoaded, setSelectedActivityIndex]);

    // Pan to selected activity and highlight marker
    useEffect(() => {
        if (!mapInstance.current || !isApiLoaded || selectedActivityIndex === null || !itinerary?.itinerary[selectedActivityIndex]) return;

        const activity = itinerary.itinerary[selectedActivityIndex];
        const position = { lat: activity.latitude, lng: activity.longitude };
        mapInstance.current.panTo(position);

        markersRef.current.forEach((marker: any, index: number) => {
            const isSelected = index === selectedActivityIndex;
            const pinElement = new (window as any).google.maps.marker.PinElement({
                background: isSelected ? '#EC4899' : '#6366F1', // secondary (pink) for selected, primary (indigo) for default
                borderColor: '#ffffff',
                glyphColor: '#ffffff',
                scale: isSelected ? 1.4 : 1,
            });
            marker.content = pinElement.element;
            marker.zIndex = isSelected ? 10 : 1;
        });

    }, [selectedActivityIndex, itinerary, isApiLoaded]);

    return <div ref={mapRef} className="absolute inset-0 bg-gray-900" />;
};

export default Map;
