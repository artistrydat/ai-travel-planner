
import React, { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { api } from '../../convex/_generated/api';
import { ArrowRightIcon, MapPinIcon, ClockIcon, SearchIcon, StarIcon } from './icons';

// --- TYPES ---
interface Itinerary {
  id: string;
  imageUrl: string;
  rank: 'Top Pick' | 'Popular' | null;
  tripPeriod: string;
  destination: string;
  title: string;
  activity: string;
  difficulty: string;
  interests: string;
  group: string;
  budget: string;
  pace: string;
}

interface SearchHistoryRecord {
  _id: string;
  _creationTime: number;
  destination: string;
  preferences: {
    destination: string;
    departureCity: string;
    duration: string;
    startDate: string;
    pace: string;
    group: string;
    interests: string;
    budget?: string;
  };
  itinerary: any;
}

// Utility function to determine rank based on certain criteria
const determineRank = (preferences: any, index: number, record: SearchHistoryRecord): 'Top Pick' | 'Popular' | null => {
  // Top picks: Recent, comprehensive itineraries with good duration
  const duration = parseInt(preferences.duration);
  const isRecent = (Date.now() - record._creationTime) < (7 * 24 * 60 * 60 * 1000); // Within last 7 days
  const isComprehensive = duration >= 7;
  
  if (index < 2 && (isRecent || isComprehensive)) return 'Top Pick';
  if (index < 5 && duration >= 3) return 'Popular';
  return null;
};

// Utility function to get primary interest from preferences
const getPrimaryActivity = (interests: string): string => {
  const interestMap: { [key: string]: string } = {
    'Adventure': 'Hiking',
    'Culture': 'Sightseeing',
    'Relaxation': 'Beach',
    'Food': 'Culinary',
    'Nature': 'Wildlife',
    'History': 'Museums',
    'Photography': 'Scenic',
    'Shopping': 'Shopping',
    'Nightlife': 'Entertainment'
  };
  
  return interestMap[interests] || 'Adventure';
};

// Utility function to determine difficulty based on pace and duration
const getDifficulty = (pace: string, duration: string): string => {
  const durationNum = parseInt(duration);
  
  if (pace === 'Relaxed') return 'Easy';
  if (pace === 'Moderate') {
    return durationNum > 10 ? 'Moderate' : 'Easy';
  }
  if (pace === 'Fast') {
    return durationNum > 7 ? 'Hard' : 'Moderate';
  }
  
  return 'Moderate';
};

// Utility function to get a representative image from itinerary
const getRepresentativeImage = (itinerary: SearchHistoryRecord): string => {
  // Try to get the first image from the itinerary
  if (itinerary?.itinerary?.itinerary?.[0]?.imageUrl) {
    return itinerary.itinerary.itinerary[0].imageUrl;
  }
  
  // Try to get any image from any day in the itinerary
  if (itinerary?.itinerary?.itinerary && Array.isArray(itinerary.itinerary.itinerary)) {
    for (const day of itinerary.itinerary.itinerary) {
      if (day?.imageUrl) {
        return day.imageUrl;
      }
    }
  }
  
  // Fallback to a default image based on destination
  const destination = itinerary.destination.toLowerCase();
  if (destination.includes('rome') || destination.includes('italy')) {
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2070&auto=format&fit=crop';
  }
  if (destination.includes('paris') || destination.includes('france')) {
    return 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop';
  }
  if (destination.includes('tokyo') || destination.includes('japan')) {
    return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2088&auto=format&fit=crop';
  }
  if (destination.includes('london') || destination.includes('england') || destination.includes('uk')) {
    return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop';
  }
  if (destination.includes('new york') || destination.includes('nyc')) {
    return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop';
  }
  if (destination.includes('dubai')) {
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop';
  }
  if (destination.includes('singapore')) {
    return 'https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=2070&auto=format&fit=crop';
  }
  
  // Generic travel fallback
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2080&auto=format&fit=crop';
};

// Utility function to create a trip title
const createTripTitle = (destination: string, interests: string, duration: string): string => {
  const destinationName = destination.split(',')[0]; // Get the main city/location
  const durationNum = parseInt(duration);
  
  const titleTemplates = {
    'Adventure': [`${destinationName} Adventure Expedition`, `Thrilling ${destinationName} Journey`, `Ultimate ${destinationName} Adventure`],
    'Culture': [`Cultural ${destinationName} Discovery`, `Historic ${destinationName} Experience`, `${destinationName} Cultural Heritage Tour`],
    'Relaxation': [`Relaxing ${destinationName} Getaway`, `Peaceful ${destinationName} Retreat`, `Serene ${destinationName} Escape`],
    'Food': [`Culinary ${destinationName} Tour`, `Gourmet ${destinationName} Experience`, `${destinationName} Food & Wine Journey`],
    'Nature': [`Natural ${destinationName} Explorer`, `Wild ${destinationName} Adventure`, `${destinationName} Nature Discovery`],
    'History': [`Historical ${destinationName} Journey`, `Ancient ${destinationName} Discovery`, `${destinationName} Through Time`],
    'Photography': [`Scenic ${destinationName} Photography Tour`, `Picture Perfect ${destinationName}`, `${destinationName} Visual Journey`],
    'Shopping': [`${destinationName} Shopping Experience`, `Retail Therapy in ${destinationName}`, `${destinationName} Market & Mall Tour`],
    'Nightlife': [`${destinationName} Nightlife Adventure`, `Party in ${destinationName}`, `${destinationName} After Dark`]
  };
  
  // Find the best matching category or use the interests directly
  let selectedTemplates = titleTemplates['Adventure']; // default
  
  for (const [category, templates] of Object.entries(titleTemplates)) {
    if (interests.toLowerCase().includes(category.toLowerCase())) {
      selectedTemplates = templates;
      break;
    }
  }
  
  // Add duration-based variations
  if (durationNum <= 2) {
    return `Quick ${destinationName} ${durationNum}-Day Tour`;
  } else if (durationNum >= 14) {
    return `Grand ${destinationName} ${durationNum}-Day Expedition`;
  }
  
  const randomTemplate = selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)];
  return randomTemplate;
};


// --- ITINERARY CARD COMPONENT ---
const ItineraryCard: React.FC<{ 
  itinerary: Itinerary; 
  onViewItinerary: (id: string) => void; 
}> = ({ itinerary, onViewItinerary }) => {
    const difficultyColors: Record<string, string> = {
        Easy: 'bg-green-100 text-green-800',
        Moderate: 'bg-yellow-100 text-yellow-800',
        Hard: 'bg-orange-100 text-orange-800',
        Expert: 'bg-red-100 text-red-800',
    };

    return (
        <div 
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col group cursor-pointer"
            onClick={() => onViewItinerary(itinerary.id)}
        >
            <div className="relative">
                <img src={itinerary.imageUrl} alt={itinerary.title} className="w-full h-56 object-cover"/>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 via-transparent to-black/10"></div>
                
                {itinerary.rank && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        <span>{itinerary.rank}</span>
                    </div>
                )}

                <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-[#0a4848] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" />
                    <span>{itinerary.tripPeriod}</span>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${difficultyColors[itinerary.difficulty] || difficultyColors.Moderate}`}>{itinerary.difficulty}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">{itinerary.activity}</span>
                </div>

                <h3 className="text-lg font-bold text-[#0a4848] group-hover:text-[#10b981] transition-colors">{itinerary.title}</h3>
                
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1 mb-4">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{itinerary.destination}</span>
                </p>

                <div className="mt-auto">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent double navigation from card click
                            onViewItinerary(itinerary.id);
                        }}
                        className="w-full text-center px-4 py-2.5 bg-[#0a4848] text-white font-bold rounded-lg hover:bg-[#0d5555] transition-colors flex items-center justify-center gap-2"
                    >
                        View Itinerary <ArrowRightIcon className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- MAIN ITINERARIES COMPONENT ---
const Itineraries: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activity, setActivity] = useState('all');
    const [difficulty, setDifficulty] = useState('all');
    const [duration, setDuration] = useState('all');
    
    const router = useRouter();

    // Fetch real data from Convex
    const searchHistoryData = useQuery(api.queries.getAllItineraries);

    // Navigation handler
    const handleViewItinerary = (itineraryId: string) => {
        router.push(`/trip/${itineraryId}`);
    };

    // Transform the real data to match our interface
    const transformedItineraries = useMemo(() => {
        if (!searchHistoryData) return [];
        
        // Sort the data first: recent first, then by duration (longer trips first)
        const sortedData = [...searchHistoryData].sort((a, b) => {
            const timeDiff = b._creationTime - a._creationTime;
            if (Math.abs(timeDiff) < (24 * 60 * 60 * 1000)) { // If within 24 hours, sort by duration
                return parseInt(b.preferences.duration) - parseInt(a.preferences.duration);
            }
            return timeDiff;
        });
        
        return sortedData.map((record: SearchHistoryRecord, index: number) => ({
            id: record._id,
            imageUrl: getRepresentativeImage(record),
            rank: determineRank(record.preferences, index, record),
            tripPeriod: `${record.preferences.duration} Days`,
            destination: record.destination,
            title: createTripTitle(record.destination, record.preferences.interests, record.preferences.duration),
            activity: getPrimaryActivity(record.preferences.interests),
            difficulty: getDifficulty(record.preferences.pace, record.preferences.duration),
            interests: record.preferences.interests,
            group: record.preferences.group,
            budget: record.preferences.budget || '0',
            pace: record.preferences.pace
        }));
    }, [searchHistoryData]);

    const filteredItineraries = useMemo(() => {
        if (!transformedItineraries) return [];
        
        return transformedItineraries.filter((item: Itinerary) => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.destination.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesActivity = activity === 'all' || 
                                  item.activity.toLowerCase().includes(activity.toLowerCase()) ||
                                  item.interests.toLowerCase().includes(activity.toLowerCase());
            const matchesDifficulty = difficulty === 'all' || item.difficulty === difficulty;
            
            const itemDuration = parseInt(item.tripPeriod.split(' ')[0]);
            const matchesDuration = duration === 'all' ||
                (duration === '1-3' && itemDuration >= 1 && itemDuration <= 3) ||
                (duration === '4-7' && itemDuration >= 4 && itemDuration <= 7) ||
                (duration === '8+' && itemDuration >= 8);
            
            return matchesSearch && matchesActivity && matchesDifficulty && matchesDuration;
        });
    }, [transformedItineraries, searchTerm, activity, difficulty, duration]);

    const commonSelectClasses = "w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition";

    // Show loading state while data is being fetched
    if (searchHistoryData === undefined) {
        return (
            <section className="bg-[#F9FAF8] py-20 lg:py-28" id="itineraries">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0a4848] tracking-tight">
                            Explore similar Next Adventure
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                            Loading amazing travel itineraries...
                        </p>
                    </div>
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0a4848]"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Show placeholder when no data exists yet
    if (searchHistoryData.length === 0) {
        return (
            <section className="bg-[#F9FAF8] py-20 lg:py-28" id="itineraries">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0a4848] tracking-tight">
                            Find Your Next Adventure
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                            Explore curated itineraries for every adventurer. Filter by activity, difficulty, and to see more perfect trips.
                        </p>
                    </div>
                    <div className="text-center py-16 px-4">
                        <h3 className="text-xl font-semibold text-[#0a4848]">No Adventures Available Yet</h3>
                        <p className="text-gray-500 mt-2">Be the first to create an amazing travel itinerary! Generated trips will appear here for others to discover.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#F9FAF8] py-12 lg:py-16" id="itineraries">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0a4848] tracking-tight">
                        Find Your Next Adventure
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed">
                        Explore curated itineraries for every adventurer. Filter by activity, difficulty, and more to find your perfect trip.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-lg mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-500 mb-1">Search Destination</label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                placeholder="e.g., 'Yosemite' or 'Chile'"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="activity-filter" className="block text-sm font-medium text-gray-500 mb-1">Activity</label>
                        <select id="activity-filter" value={activity} onChange={e => setActivity(e.target.value)} className={commonSelectClasses}>
                            <option value="all">All Activities</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Culture">Culture</option>
                            <option value="Food">Food</option>
                            <option value="Nature">Nature</option>
                            <option value="History">History</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Relaxation">Relaxation</option>
                        </select>
                     </div>
                     <div>
                        <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-500 mb-1">Difficulty</label>
                        <select id="difficulty-filter" value={difficulty} onChange={e => setDifficulty(e.target.value)} className={commonSelectClasses}>
                            <option value="all">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Hard">Hard</option>
                            <option value="Expert">Expert</option>
                        </select>
                     </div>
                     <div>
                        <label htmlFor="duration-filter" className="block text-sm font-medium text-gray-500 mb-1">Duration</label>
                        <select id="duration-filter" value={duration} onChange={e => setDuration(e.target.value)} className={commonSelectClasses}>
                            <option value="all">Any Duration</option>
                            <option value="1-3">1-3 Days</option>
                            <option value="4-7">4-7 Days</option>
                            <option value="8+">8+ Days</option>
                        </select>
                     </div>
                </div>

                {/* Itineraries Grid */}
                {filteredItineraries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItineraries.map((itinerary: Itinerary) => (
                            <ItineraryCard 
                                key={itinerary.id} 
                                itinerary={itinerary} 
                                onViewItinerary={handleViewItinerary}
                            />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16 px-4">
                        <h3 className="text-xl font-semibold text-[#0a4848]">No Adventures Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters to find your perfect itinerary.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Itineraries;
