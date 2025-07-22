"use server";

import { Itinerary, Activity } from '../types/types';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Type for verified activities (placeId is guaranteed to exist)
type VerifiedActivity = Activity & { placeId: string };

interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  photos?: Array<{
    photo_reference: string;
  }>;
}

interface GooglePlacesResponse {
  status: string;
  results: GooglePlaceResult[];
  error_message?: string;
}

/**
 * Verifies and enriches an AI-generated itinerary with real Google Places data
 * This function takes the creative output from the AI and replaces it with verified, real-world data
 */
export const verifyAndEnrichItinerary = async (aiItinerary: Itinerary): Promise<Itinerary> => {
  if (!GOOGLE_API_KEY) {
    console.error("Google Maps API key not found. Please set GOOGLE_MAPS_API_KEY environment variable.");
    throw new Error("Google Maps API configuration missing");
  }

  console.log(`[Places Verification] Starting verification for ${aiItinerary.itinerary.length} activities in ${aiItinerary.destination}`);

  const enrichedActivities = await Promise.all(
    aiItinerary.itinerary.map(async (activity, index): Promise<VerifiedActivity | null> => {
      console.log(`[Places Verification] Processing ${index + 1}/${aiItinerary.itinerary.length}: "${activity.title}"`);
      
      // Create a search query combining the activity title with the destination
      const searchQuery = `${activity.title} in ${aiItinerary.destination}`;
      
      try {
        // Make a real API call to Google Places Text Search
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_API_KEY}`;
        
        console.log(`[Places Verification] Searching for: "${searchQuery}"`);
        
        const response = await fetch(searchUrl);
        const data: GooglePlacesResponse = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
          // We found a real place! Use its verified data
          const realPlace = data.results[0];
          
          console.log(`[Places Verification] ✅ Found real place: "${realPlace.name}" (${realPlace.place_id})`);
          
          return {
            ...activity, // Keep the AI's creative description, category, startTime, etc.
            // OVERWRITE with real, verified data
            title: realPlace.name, // Use the official name from Google
            placeId: realPlace.place_id,
            latitude: realPlace.geometry.location.lat,
            longitude: realPlace.geometry.location.lng,
            rating: realPlace.rating || 3.5,
            ratingCount: realPlace.user_ratings_total || 0,
          } satisfies VerifiedActivity;
        } else if (data.status === 'ZERO_RESULTS') {
          console.warn(`[Places Verification] ❌ No results found for: "${searchQuery}"`);
          
          // Try a more generic search as fallback
          const fallbackQuery = `${activity.category.toLowerCase()} in ${aiItinerary.destination}`;
          console.log(`[Places Verification] Trying fallback search: "${fallbackQuery}"`);
          
          const fallbackUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(fallbackQuery)}&key=${GOOGLE_API_KEY}`;
          const fallbackResponse = await fetch(fallbackUrl);
          const fallbackData: GooglePlacesResponse = await fallbackResponse.json();
          
          if (fallbackData.status === 'OK' && fallbackData.results.length > 0) {
            const fallbackPlace = fallbackData.results[0];
            console.log(`[Places Verification] ⚠️  Using fallback place: "${fallbackPlace.name}"`);
            
            return {
              ...activity,
              title: fallbackPlace.name,
              placeId: fallbackPlace.place_id,
              latitude: fallbackPlace.geometry.location.lat,
              longitude: fallbackPlace.geometry.location.lng,
              rating: fallbackPlace.rating || 3.5,
              ratingCount: fallbackPlace.user_ratings_total || 0,
            } satisfies VerifiedActivity;
          }
          
          // No fallback worked, mark for removal
          return null;
        } else {
          console.error(`[Places Verification] API Error for "${searchQuery}":`, data.status, data.error_message);
          return null; // Mark for removal
        }
      } catch (error) {
        console.error(`[Places Verification] Network error during place verification for "${searchQuery}":`, error);
        return null; // Mark for removal
      }
    })
  );

  // Filter out any activities that couldn't be verified (null values)
  const verifiedActivities = enrichedActivities.filter((activity): activity is VerifiedActivity => activity !== null);

  console.log(`[Places Verification] Verification complete. ${verifiedActivities.length}/${aiItinerary.itinerary.length} activities verified and kept.`);

  // If we lost too many activities, this might indicate the destination is too obscure
  if (verifiedActivities.length < aiItinerary.itinerary.length * 0.5) {
    console.warn(`[Places Verification] Warning: Only ${verifiedActivities.length}/${aiItinerary.itinerary.length} activities could be verified. The destination "${aiItinerary.destination}" might be too obscure or remote.`);
  }

  return {
    ...aiItinerary,
    itinerary: verifiedActivities,
  };
};

/**
 * Validates a single place ID to ensure it exists and is accessible
 * Useful for debugging or manual verification
 */
export const validatePlaceId = async (placeId: string): Promise<boolean> => {
  if (!GOOGLE_API_KEY) {
    throw new Error("Google Maps API key not found");
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.status === 'OK';
  } catch (error) {
    console.error("Error validating place ID:", error);
    return false;
  }
};
