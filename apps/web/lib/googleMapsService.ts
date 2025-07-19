import { Activity } from '../types/types';

// Helper to fetch place photos using the modern Place class
export const fetchPlacePhotos = async (activities: Activity[]): Promise<Activity[]> => {
    // Check if Google Maps API is loaded
    if (!(window as any).google?.maps?.places?.Place) {
        console.warn("Google Maps Places API (Place class) not available. Using fallback images.");
        return activities.map((activity, index) => ({
            ...activity,
            imageUrl: `https://images.unsplash.com/photo-${1542051841857 + index}?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3`
        }));
    }

    const updatedActivities = await Promise.all(
        activities.map(async (activity, index) => {
            if (!activity.placeId) {
                // Use a category-based fallback image
                const categoryImages = {
                    'Food': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop',
                    'Entertainment': 'https://images.unsplash.com/photo-1489599936514-b09c39009b51?q=80&w=800&auto=format&fit=crop',
                    'Culture': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop',
                    'Outdoor': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
                    'Shopping': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
                    'Other': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop'
                };
                return { 
                    ...activity, 
                    imageUrl: categoryImages[activity.category] || categoryImages['Other']
                };
            }

            try {
                // Use the modern Place class which is promise-based
                const place = new (window as any).google.maps.places.Place({ id: activity.placeId });
                await place.fetchFields({ fields: ['photos'] });

                if (place.photos && place.photos.length > 0) {
                    // getURI is used with v=beta of the Maps JS API
                    const imageUrl = place.photos[0].getURI({ maxHeight: 800, maxWidth: 800 });
                    return { ...activity, imageUrl };
                }
                
                console.warn(`No photos found for placeId ${activity.placeId}, using category fallback`);
                // Use category-based fallback
                const categoryImages = {
                    'Food': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop',
                    'Entertainment': 'https://images.unsplash.com/photo-1489599936514-b09c39009b51?q=80&w=800&auto=format&fit=crop',
                    'Culture': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop',
                    'Outdoor': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
                    'Shopping': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
                    'Other': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop'
                };
                return { 
                    ...activity, 
                    imageUrl: categoryImages[activity.category] || categoryImages['Other']
                };
            } catch (error) {
                console.warn(`Could not get photos for placeId ${activity.placeId}:`, error);
                
                // Use category-based fallback with unique variations
                const categoryImageSets = {
                    'Food': [
                        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop'
                    ],
                    'Entertainment': [
                        'https://images.unsplash.com/photo-1489599936514-b09c39009b51?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop'
                    ],
                    'Culture': [
                        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?q=80&w=800&auto=format&fit=crop'
                    ],
                    'Outdoor': [
                        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=800&auto=format&fit=crop'
                    ],
                    'Shopping': [
                        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=800&auto=format&fit=crop'
                    ],
                    'Other': [
                        'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=800&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop'
                    ]
                };
                
                const categoryImages = categoryImageSets[activity.category] || categoryImageSets['Other'];
                const imageIndex = index % categoryImages.length;
                
                return { 
                    ...activity, 
                    imageUrl: categoryImages[imageIndex]
                };
            }
        })
    );

    return updatedActivities;
};
