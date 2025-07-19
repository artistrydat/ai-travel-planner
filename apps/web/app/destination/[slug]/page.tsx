"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Sample destination data - in a real app, this would come from your search history API
const SAMPLE_DESTINATIONS = {
  'bali': {
    name: 'Kuta Selatan, Bali, Indonesia',
    heroImage: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=1200&auto=format&fit=crop',
    description: 'Experience the tropical paradise of Bali with pristine beaches, ancient temples, and vibrant culture.',
    highlights: [
      { icon: '🏖️', title: 'Pristine Beaches', description: 'Pandawa, Nyang Nyang, and Balangan beaches' },
      { icon: '🏛️', title: 'Ancient Temples', description: 'Uluwatu Temple with traditional Kecak dance' },
      { icon: '🌊', title: 'Water Sports', description: 'Surfing, diving, and water adventures' },
      { icon: '🍜', title: 'Local Cuisine', description: 'Authentic Balinese dining experiences' }
    ],
    stats: {
      avgDuration: '5-7 days',
      bestTime: 'Apr - Oct',
      budget: '$800 - $2000',
      popularity: '4.8/5'
    },
    featuredActivities: [
      {
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop',
        title: 'Uluwatu Temple Exploration',
        category: 'Culture',
        duration: '2 hours',
        rating: 4.7
      },
      {
        image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=800&auto=format&fit=crop',
        title: 'Water Sports at Tanjung Benoa',
        category: 'Adventure',
        duration: '3 hours',
        rating: 4.5
      },
      {
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
        title: 'Relax at Pandawa Beach',
        category: 'Outdoor',
        duration: '2.5 hours',
        rating: 4.6
      }
    ]
  },
  'dubai': {
    name: 'Dubai, United Arab Emirates',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
    description: 'Discover the futuristic city of Dubai with iconic skyscrapers, luxury shopping, and desert adventures.',
    highlights: [
      { icon: '🏢', title: 'Iconic Skyline', description: 'Burj Khalifa and modern architecture' },
      { icon: '🛍️', title: 'Luxury Shopping', description: 'World-class malls and traditional souks' },
      { icon: '🏜️', title: 'Desert Safari', description: 'Dune bashing and camel experiences' },
      { icon: '🍽️', title: 'Fine Dining', description: 'International cuisine and rooftop restaurants' }
    ],
    stats: {
      avgDuration: '4-6 days',
      bestTime: 'Nov - Mar',
      budget: '$1200 - $3000',
      popularity: '4.9/5'
    },
    featuredActivities: [
      {
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
        title: 'Burj Khalifa Experience',
        category: 'Sightseeing',
        duration: '2 hours',
        rating: 4.8
      },
      {
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop',
        title: 'Desert Safari Adventure',
        category: 'Adventure',
        duration: '6 hours',
        rating: 4.7
      },
      {
        image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=800&auto=format&fit=crop',
        title: 'Dubai Marina Cruise',
        category: 'Leisure',
        duration: '2 hours',
        rating: 4.6
      }
    ]
  }
};

const DestinationPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState<any>(null);
  const slug = params.slug as string;

  useEffect(() => {
    // Apply Telegram WebApp theme colors if available
    if (typeof window !== 'undefined') {
      const telegram = (window as any).Telegram;
      if (telegram?.WebApp) {
        telegram.WebApp.ready();
        document.documentElement.style.setProperty('--tg-theme-bg-color', telegram.WebApp.backgroundColor || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-button-color', telegram.WebApp.buttonColor || '#2481cc');
      }
    }

    // Load destination data
    const destData = SAMPLE_DESTINATIONS[slug as keyof typeof SAMPLE_DESTINATIONS];
    if (destData) {
      setDestination(destData);
    }
  }, [slug]);

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-xl">Loading destination...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden" style={{
      backgroundColor: 'var(--tg-theme-bg-color, var(--color-bg))',
      color: 'var(--tg-theme-text-color, var(--color-text-base))'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/15 to-teal-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/15 to-red-600/15 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${destination.heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80"></div>
        </div>

        {/* Header */}
        <header className="relative z-20 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/landing"
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
                </svg>
                Back to Home
              </Link>              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-white font-bold">AI Travel Planner</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-medium backdrop-blur-sm">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Popular Destination
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                  {destination.name}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                {destination.description}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                  <svg className="w-6 h-6 text-emerald-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 11H7v5a2 2 0 0 0 2 2h1v-6h2v6h1a2 2 0 0 0 2-2v-5h-2m4-6.32l2.5 2.5V11h2V6.18L14 1.68 12.5 3.18 14 4.68M20 3v18H4V3h16m0-2H4c-1.11 0-2 .89-2 2v18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V3c0-1.11-.89-2-2-2z"/>
                  </svg>
                  <p className="text-white font-bold">{destination.stats.avgDuration}</p>
                  <p className="text-gray-300 text-sm">Duration</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                  <svg className="w-6 h-6 text-blue-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                  </svg>
                  <p className="text-white font-bold">{destination.stats.bestTime}</p>
                  <p className="text-gray-300 text-sm">Best Time</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                  <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                  </svg>
                  <p className="text-white font-bold">{destination.stats.budget}</p>
                  <p className="text-gray-300 text-sm">Budget</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                  <svg className="w-6 h-6 text-yellow-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                  </svg>
                  <p className="text-white font-bold">{destination.stats.popularity}</p>
                  <p className="text-gray-300 text-sm">Rating</p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => router.push('/')}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="text-xl">✈️</span>
                <span className="relative z-10">Plan Your Trip Here</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative z-10 -mt-20">
        {/* Highlights Section */}
        <section className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Why You'll Love This Destination
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {destination.highlights.map((highlight: any, index: number) => {
                const gradients = [
                  'from-emerald-500 to-teal-600',
                  'from-blue-500 to-cyan-600',
                  'from-purple-500 to-pink-600',
                  'from-orange-500 to-red-600'
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <div key={index} className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {highlight.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 text-center">{highlight.title}</h3>
                      <p className="text-gray-300 text-center leading-relaxed">{highlight.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Activities */}
        <section className="bg-gradient-to-br from-slate-900/60 to-black/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Top Experiences
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {destination.featuredActivities.map((activity: any, index: number) => (
                <div key={index} className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 hover:scale-105">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 rounded-full px-3 py-1 backdrop-blur-sm">
                      <span className="text-emerald-300 text-sm font-medium">{activity.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors">
                      {activity.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                        </svg>
                        <span className="text-gray-300 text-sm">{activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                        </svg>
                        <span className="text-white font-medium">{activity.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                Ready to Explore {destination.name.split(',')[0]}?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Create your personalized itinerary with AI-powered recommendations
            </p>
            
            <button
              onClick={() => router.push('/')}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold py-6 px-12 rounded-2xl text-xl transition-all duration-500 transform hover:scale-105 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-2xl">🚀</span>
              <span className="relative z-10">Start Planning Now</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DestinationPage;
