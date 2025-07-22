import { Activity } from '../types/types';

// Define fallback images outside the function to avoid redeclaration
const CATEGORY_FALLBACK_IMAGE_SETS = {
  Food: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop'
  ],
  Entertainment: [
    'https://images.unsplash.com/photo-1489599936514-b09c39009b51?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop'
  ],
  Culture: [
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?q=80&w=800&auto=format&fit=crop'
  ],
  Outdoor: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=800&auto=format&fit=crop'
  ],
  Shopping: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=800&auto=format&fit=crop'
  ],
  Other: [
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop'
  ]
};

const CATEGORY_FALLBACK_IMAGES = Object.fromEntries(
  Object.entries(CATEGORY_FALLBACK_IMAGE_SETS).map(([category, urls]) => [category, urls[0]])
) as Record<string, string>;

// Helper to fetch place photos using the modern Place class with enhanced debugging
export const fetchPlacePhotos = async (activities: Activity[]): Promise<Activity[]> => {
  console.log(`[Photo Fetch] Starting process for ${activities.length} activities.`);
  console.log("[Photo Fetch] Input activities:", JSON.stringify(activities, null, 2));

  // Check if Google Maps API is loaded
  if (!(window as any).google?.maps?.places?.Place) {
    console.error("[Photo Fetch] CRITICAL: Google Maps Places API (Place class) not available. Check your <script> tag for `&libraries=places&v=beta`.");
    console.error("[Photo Fetch] Expected script tag format: <script src=\"https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=places&v=beta\"></script>");
    return activities.map((activity, index) => ({
      ...activity,
      imageUrl: CATEGORY_FALLBACK_IMAGE_SETS.Other[index % CATEGORY_FALLBACK_IMAGE_SETS.Other.length]
    }));
  }

  console.log("[Photo Fetch] Google Maps Places API is available.");

  const updatedActivities = await Promise.all(
    activities.map(async (activity, index) => {
      console.log(`[Photo Fetch] Processing activity ${index + 1}/${activities.length}: "${activity.title}"`);
      
      // Handle missing placeId immediately
      if (!activity.placeId) {
        console.warn(`[Photo Fetch] Activity "${activity.title}" has no placeId. Using category fallback for category: ${activity.category}`);
        return { 
          ...activity, 
          imageUrl: CATEGORY_FALLBACK_IMAGES[activity.category] || CATEGORY_FALLBACK_IMAGES.Other
        };
      }

      try {
        console.log(`[Photo Fetch] Attempting to fetch photo for placeId: ${activity.placeId} (${activity.title})`);
        
        // Use the modern Place class which is promise-based
        const place = new (window as any).google.maps.places.Place({ id: activity.placeId });
        console.log(`[Photo Fetch] Created Place object for ${activity.placeId}`);
        
        await place.fetchFields({ fields: ['photos'] });
        console.log(`[Photo Fetch] fetchFields completed for ${activity.placeId}`);

        if (place.photos?.length > 0) {
          console.log(`[Photo Fetch] Found ${place.photos.length} photos for placeId ${activity.placeId}`);
          
          // Use getURI with v=beta of the Maps JS API
          const imageUrl = place.photos[0].getURI({ maxHeight: 800, maxWidth: 800 });
          console.log(`[Photo Fetch] SUCCESS for placeId ${activity.placeId}. URL: ${imageUrl.substring(0, 80)}...`);
          return { ...activity, imageUrl };
        }
        
        console.warn(`[Photo Fetch] No photos found for placeId ${activity.placeId} ("${activity.title}"). Using category fallback for category: ${activity.category}`);
        return { 
          ...activity, 
          imageUrl: CATEGORY_FALLBACK_IMAGES[activity.category] || CATEGORY_FALLBACK_IMAGES.Other
        };
      } catch (error) {
        console.error(`[Photo Fetch] API ERROR for placeId ${activity.placeId} ("${activity.title}"):`, error);
        console.error(`[Photo Fetch] Error details:`, {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // Use category-based fallback with unique variations
        const categorySet = CATEGORY_FALLBACK_IMAGE_SETS[activity.category] || CATEGORY_FALLBACK_IMAGE_SETS.Other;
        const imageIndex = index % categorySet.length;
        
        console.warn(`[Photo Fetch] Using fallback image ${imageIndex + 1}/${categorySet.length} for category: ${activity.category}`);
        
        return { 
          ...activity, 
          imageUrl: categorySet[imageIndex]
        };
      }
    })
  );

  console.log(`[Photo Fetch] Process completed. ${updatedActivities.filter(a => a.imageUrl.includes('googleapis')).length}/${updatedActivities.length} activities got Google Maps photos.`);
  return updatedActivities;
};