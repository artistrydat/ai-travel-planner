import { Activity } from '../types';

// Helper to fetch place photos using the modern Place class
export const fetchPlacePhotos = async (activities: Activity[]): Promise<Activity[]> => {
    if (!(window as any).google?.maps?.places?.Place) {
        console.error("Google Maps Places API (Place class) not available.");
        return activities;
    }

    const updatedActivities = await Promise.all(
        activities.map(async (activity) => {
            if (!activity.placeId) {
                return activity; // Return activity as is if there's no placeId
            }

            try {
                // Use the modern Place class which is promise-based
                const place = new (window as any).google.maps.places.Place({ id: activity.placeId });
                await place.fetchFields({ fields: ['photos'] });

                if (place.photos && place.photos.length > 0) {
                    // getURI is used with v=beta of the Maps JS API
                    const imageUrl = place.photos[0].getURI({ maxHeight: 800 });
                    return { ...activity, imageUrl };
                }
                console.warn(`No photos found for placeId ${activity.placeId}`);
                return activity;
            } catch (error) {
                console.warn(`Could not get photos for placeId ${activity.placeId}:`, error);
                return activity; // Return original activity on error
            }
        })
    );

    return updatedActivities;
};
