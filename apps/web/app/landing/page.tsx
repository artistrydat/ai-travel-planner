"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import { useSEO } from '../../hooks/useSEO';
import { ITEMS } from '../../components/creditstore/data/items';
import { DEFAULT_OPERATION_COSTS, formatCostDisplay } from '../../config/operationCosts';
import { siteMetadata } from '../../data/metadata';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/sections/HeroSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import TrustSection from '../../components/sections/TrustSection';

interface SearchItem {
  destination: string;
  createdAt: number;
}

const LandingPage: React.FC = () => {
  const router = useRouter();
  const { isTelegram, isReady, user, webApp } = useTelegramWebApp();
  
  // SEO Hook
  useSEO('landing');

  // Query recent searches for popular destinations
  const recentSearches = useQuery(api.queries.getRecentPopularSearches) || [];

  useEffect(() => {
    // Apply basic Telegram theme if available
    if (isTelegram && webApp) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.backgroundColor || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-button-color', webApp.themeParams.button_color || '#f59e0b');
    }
  }, [isTelegram, webApp]);

  const handleTelegramLaunch = () => {
    if (isTelegram) {
      // If already in Telegram, navigate to main app
      router.push('/');
    } else {
      // If not in Telegram, show instructions
      alert('Please open this app through Telegram to get started with your 10 free credits!');
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{
      backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      color: 'var(--tg-theme-text-color, #000000)'
    }}>

      <Header onCtaClick={handleTelegramLaunch} />

      <main className="relative">
        <HeroSection onCtaClick={handleTelegramLaunch} />
        
        <TrustSection />
        
        <FeaturesSection />

        {/* Popular Destinations - Luxury Gallery Style */}
        {recentSearches.length > 0 && (
          <div className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center bg-amber-50 border border-amber-200 rounded-full px-6 py-2 mb-6">
                  <span className="text-amber-600 font-medium text-sm tracking-wide">
                    {siteMetadata.destinations.badge}
                  </span>
                </div>
                <h3 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
                  {siteMetadata.destinations.title.split(' ').slice(0, -1).join(' ')} 
                  <span className="font-bold bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent"> {siteMetadata.destinations.title.split(' ').slice(-1)}</span>
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                  {siteMetadata.destinations.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentSearches.slice(0, 6).map((search: any, index: number) => {
                  const itinerary = search.itinerary?.itinerary?.[0];
                  const displayName = search.destination.split(',')[0];
                  
                  return (
                    <Link
                      key={index}
                      href={`/trip/${search._id}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100/50 group-hover:border-amber-200">
                        {/* Image with luxury overlay */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
                          {itinerary?.imageUrl ? (
                            <>
                              <img
                                src={itinerary.imageUrl}
                                alt={itinerary.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-200/50 to-rose-200/50 flex items-center justify-center">
                              <span className="text-6xl opacity-60">🌍</span>
                            </div>
                          )}
                          {/* Luxury badge */}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-amber-600 text-xs font-medium tracking-wide">CURATED</span>
                          </div>
                        </div>
                        
                        {/* Content with luxury spacing */}
                        <div className="p-6">
                          <h4 className="font-light text-gray-900 mb-2 text-xl tracking-wide group-hover:text-amber-600 transition-colors duration-300">
                            {displayName}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed font-light line-clamp-2">
                            {itinerary?.title || `Experience ${displayName} through the lens of sophisticated AI curation`}
                          </p>
                          <div className="mt-4 flex items-center text-amber-600 group-hover:text-amber-700 transition-colors duration-300">
                            <span className="text-sm font-light tracking-wide">Explore Experience</span>
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Credit Packages - Sophisticated Luxury Pricing */}
        <div className="bg-gradient-to-br from-gray-50 via-amber-50/30 to-rose-50/30 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full px-6 py-2 mb-6">
                <span className="text-amber-600 font-medium text-sm tracking-wide">
                  {siteMetadata.pricing.badge}
                </span>
              </div>
              <h3 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
                {siteMetadata.pricing.title.split(' ').slice(0, -2).join(' ')} 
                <span className="font-bold bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent"> {siteMetadata.pricing.title.split(' ').slice(-2).join(' ')}</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                {siteMetadata.pricing.description}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {ITEMS.map((item, index) => {
                const isPopular = item.bonus && item.bonus > 0;
                
                return (
                  <div key={item.id} className={`relative bg-white/90 backdrop-blur-sm rounded-3xl border-2 p-8 ${isPopular ? 'border-amber-300 shadow-2xl scale-105' : 'border-amber-100 shadow-lg'} hover:shadow-2xl transition-all duration-500 group`}>
                    {isPopular && (
                      <>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-light tracking-wide shadow-lg">
                          Most Distinguished
                        </div>
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl"></div>
                      </>
                    )}
                    
                    <div className="text-center relative">
                      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                      <h4 className="text-2xl font-light text-gray-900 mb-3 tracking-wide">
                        {item.name.replace(/^[📖⭐🌟]\s*/, '')}
                      </h4>
                      <div className="text-4xl font-light text-gray-900 mb-6">
                        <span className="text-amber-500">⭐</span> {item.price}
                      </div>
                      <div className="mb-8">
                        <p className="text-2xl font-light text-gray-800 mb-2">
                          {item.credits + (item.bonus || 0)} Credits
                        </p>
                        {item.bonus && (
                          <p className="text-gray-500 font-light">
                            ({item.credits} + {item.bonus} complimentary)
                          </p>
                        )}
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-8 font-light">
                        {item.description.length > 120 ? item.description.substring(0, 120) + '...' : item.description}
                      </p>
                      
                      {item.bonus && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                          <span className="text-amber-700 font-light tracking-wide">
                            {Math.round((item.bonus / item.credits) * 100)}% Complimentary Credits
                          </span>
                        </div>
                      )}
                      
                      {/* Luxury decoration */}
                      <div className="mt-6 flex justify-center">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Operation Costs Info - Luxury Style */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl px-8 py-6 shadow-lg">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                    <span className="text-amber-600 text-xl">�</span>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-light text-lg tracking-wide">Transparent Excellence</p>
                    <p className="text-gray-600 font-light">
                      {formatCostDisplay(DEFAULT_OPERATION_COSTS.itineraryGeneration.costPerDay)} per curated day • 
                      Premium export: {formatCostDisplay(DEFAULT_OPERATION_COSTS.export.pdfFile)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA - Grand Leisure Inspired Elegance */}
        <div className="bg-gradient-to-br from-amber-900 via-orange-800 to-rose-800 py-24 relative overflow-hidden">
          {/* Luxury background pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-900/50 to-rose-900/50"></div>
            <div className="absolute top-20 left-20 w-64 h-64 border border-amber-400/20 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 border border-rose-400/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-orange-400/10 rounded-full"></div>
          </div>
          
          <div className="max-w-5xl mx-auto px-6 text-center relative">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
                <span className="text-amber-200 font-light text-sm tracking-[0.2em] uppercase">Join the Elite</span>
              </div>
            </div>
            
            <h3 className="text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
              Your Extraordinary Journey
              <br />
              <span className="font-bold bg-gradient-to-r from-amber-200 to-rose-200 bg-clip-text text-transparent">
                Awaits Discovery
              </span>
            </h3>
            
            <p className="text-2xl text-amber-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Step into a world where artificial intelligence meets sophisticated travel curation. 
              Join thousands of discerning travelers who have elevated their adventures.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <button
                onClick={handleTelegramLaunch}
                className="bg-white text-gray-900 py-5 px-12 rounded-2xl text-xl font-light hover:shadow-2xl transition-all duration-500 inline-flex items-center gap-4 group hover:bg-amber-50"
                style={{
                  backgroundColor: 'white'
                }}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">✈️</span>
                <span className="tracking-wide">Begin Your Journey</span>
              </button>
              
              <div className="text-amber-200 font-light">
                <span className="text-lg">Available exclusively on</span>
                <div className="font-medium tracking-wide text-xl mt-1">Telegram</div>
              </div>
            </div>
            
            {/* Elegant testimonial or stat */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-4">
                <div className="flex items-center gap-4 text-amber-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">★</span>
                  </div>
                  <div className="text-left">
                    <p className="font-light text-lg">"The epitome of intelligent travel curation"</p>
                    <p className="text-amber-300/80 text-sm font-light">— Elite Travel Collective</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
