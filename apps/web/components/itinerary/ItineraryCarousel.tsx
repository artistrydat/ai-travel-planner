"use client";

import React, { useRef, useEffect } from 'react';
import { Itinerary, Activity } from '../../types';
import { Icon } from '../common/Icon';
import { useItineraryStore } from '../../store/itineraryStore';
import { useUIStore } from '../../store/uiStore';

const ActivityCard: React.FC<{ activity: Activity, isSelected: boolean, onClick: () => void }> = ({ activity, isSelected, onClick }) => {
    const fallbackImage = 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop';
    
    return (
        <div
            onClick={onClick}
            className={`w-64 flex-shrink-0 snap-center rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 cursor-pointer border-2 ${isSelected ? 'scale-100 opacity-100 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'scale-95 opacity-80 border-transparent'}`}
        >
            <div className="relative h-32">
                <img 
                    src={activity.imageUrl || fallbackImage} 
                    alt={activity.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.currentTarget.src = fallbackImage }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-1.5 left-1.5 bg-amber-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">Day {activity.day}</div>
                <div className="absolute top-1.5 right-1.5 bg-black/50 text-white text-xs font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">{activity.startTime}</div>
                <div className={`absolute bottom-1.5 right-1.5 p-1.5 rounded-full shadow transition-colors ${isSelected ? 'bg-pink-500' : 'bg-white/90'}`}>
                    <Icon name="map-pin" className={`w-4 h-4 transition-colors ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                </div>
            </div>
            <div className="bg-slate-800 p-3">
                <h3 className="font-bold text-base truncate text-white">{activity.title}</h3>
                <p className="text-xs text-gray-300 h-8 overflow-hidden text-ellipsis leading-tight">{activity.description}</p>
                <div className="flex items-center justify-between mt-1.5 text-xs">
                     <div className="flex items-center gap-1 text-white">
                        <Icon name="star" className="w-3 h-3 text-amber-400 fill-current" />
                        <span className="font-semibold">{activity.rating}</span>
                        <span className="text-gray-400">({activity.ratingCount})</span>
                     </div>
                     <div className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full text-xs font-semibold">
                        {activity.durationHours}h
                     </div>
                </div>
            </div>
        </div>
    );
}

const ItineraryCarousel: React.FC = () => {
    const { itinerary } = useItineraryStore();
    const { selectedActivityIndex, setSelectedActivityIndex } = useUIStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedActivityIndex !== null && scrollContainerRef.current) {
            const selectedCard = scrollContainerRef.current.children[selectedActivityIndex];
            if (selectedCard) {
                selectedCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }
        }
    }, [selectedActivityIndex]);

    const scroll = (direction: 'left' | 'right') => {
        if (selectedActivityIndex === null || !itinerary) return;
        const newIndex = direction === 'left' ? Math.max(0, selectedActivityIndex - 1) : Math.min(itinerary.itinerary.length - 1, selectedActivityIndex + 1);
        setSelectedActivityIndex(newIndex);
    };

    if (!itinerary) return null;
    
    return (
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
            <div className="relative p-2 md:pb-4">
                <div ref={scrollContainerRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 no-scrollbar pointer-events-auto">
                    {itinerary.itinerary.map((activity, index) => (
                       <ActivityCard
                            key={index}
                            activity={activity}
                            isSelected={selectedActivityIndex === index}
                            onClick={() => setSelectedActivityIndex(index)}
                       />
                    ))}
                </div>
                {itinerary.itinerary.length > 1 && (
                    <>
                    <button onClick={() => scroll('left')} aria-label="Previous Activity" className="absolute left-0.5 top-1/2 -translate-y-6 bg-gradient-to-br from-indigo-500 to-pink-500 text-white p-1.5 rounded-full shadow-lg pointer-events-auto hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100" disabled={selectedActivityIndex === 0}>
                        <Icon name="arrow-left" className="w-4 h-4"/>
                    </button>
                    <button onClick={() => scroll('right')} aria-label="Next Activity" className="absolute right-0.5 top-1/2 -translate-y-6 bg-gradient-to-br from-indigo-500 to-pink-500 text-white p-1.5 rounded-full shadow-lg pointer-events-auto hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100" disabled={selectedActivityIndex === itinerary.itinerary.length - 1}>
                        <Icon name="arrow-right" className="w-4 h-4"/>
                    </button>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-auto bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                        {itinerary.itinerary.map((_, index) => (
                            <button key={index} onClick={() => setSelectedActivityIndex(index)} aria-label={`Go to activity ${index+1}`} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${selectedActivityIndex === index ? 'bg-pink-400 scale-125' : 'bg-white/50'}`}></button>
                        ))}
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ItineraryCarousel;
