"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import { ITEMS } from '../../components/creditstore/data/items';
import { DEFAULT_OPERATION_COSTS, formatCostDisplay } from '../../config/operationCosts';

interface SearchItem {
  destination: string;
  createdAt: number;
}

const LandingPage: React.FC = () => {
  const router = useRouter();
  const { isTelegram, isReady, user, webApp } = useTelegramWebApp();

  // Query recent searches for popular destinations
  const recentSearches = useQuery(api.queries.getRecentPopularSearches) || [];

  useEffect(() => {
    // Apply basic Telegram theme if available
    if (isTelegram && webApp) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.backgroundColor || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-button-color', webApp.themeParams.button_color || '#2481cc');
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

      {/* Header - Airbnb Style */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50" style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        borderColor: 'var(--tg-theme-text-color, rgba(229,231,235,0.3))'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center" style={{
                backgroundColor: 'var(--tg-theme-button-color, #f43f5e)'
              }}>
                <span className="text-white text-sm font-bold">✈️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-rose-500">
                  AI Travel Planner
                </h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/privacy" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium" style={{
                color: 'var(--tg-theme-text-color, #374151)'
              }}>
                Privacy
              </Link>
              <Link href="/credits" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium" style={{
                color: 'var(--tg-theme-text-color, #374151)'
              }}>
                Credits
              </Link>
              <button
                onClick={handleTelegramLaunch}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Airbnb Inspired */}
      <main className="relative">
        {/* Clean Hero Section */}
        <div className="bg-gray-50 pt-16 pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              {/* Main Headline */}
              <h2 className="text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
                Your next adventure
                <br />
                <span className="text-rose-500">starts here</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Discover amazing destinations with AI-powered travel planning. Get personalized itineraries, expert recommendations, and seamless trip organization.
              </p>

              {/* Search-style Interface */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 max-w-4xl mx-auto border border-gray-100">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Where to?</label>
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <span className="text-gray-500">Search destinations</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">When?</label>
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <span className="text-gray-500">Add dates</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Who?</label>
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <span className="text-gray-500">Add travelers</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleTelegramLaunch}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 px-8 rounded-lg text-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <span>🚀</span>
                    <span>Start Planning</span>
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Free 10 credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⚡</span>
                  </div>
                  <span>Instant AI planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🌟</span>
                  </div>
                  <span>23K+ travelers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators - Simple logos */}
        <div className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">AI</span>
                </div>
                <span className="text-gray-600 font-medium">Travel Tech</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">⚡</span>
                </div>
                <span className="text-gray-600 font-medium">Instant Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">🌍</span>
                </div>
                <span className="text-gray-600 font-medium">Global Coverage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - Clean Airbnb Style */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                Why choose AI Travel Planner?
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the future of travel planning with AI-powered recommendations and seamless organization.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Comprehensive Travel Guides */}
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19M17 7H7V9H17V7M17 11H7V13H17V11M14 15H7V17H14V15Z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Smart Itineraries</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  AI-generated travel plans tailored to your preferences and budget.
                </p>
              </div>

              {/* Expert Tips */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,10L16.5,8.5L11,14L7.5,10.5L6,12L11,16.5Z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Expert Recommendations</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discover hidden gems and local favorites with AI-powered insights.
                </p>
              </div>

              {/* Personalized Recommendations */}
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Personalized Experience</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Custom recommendations based on your interests and travel style.
                </p>
              </div>

              {/* Interactive Community */}
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,6A2,2 0 0,0 14,8A2,2 0 0,0 16,10A2,2 0 0,0 18,8A2,2 0 0,0 16,6M8,6C10.21,6 12,7.79 12,10C12,12.21 10.21,14 8,14C5.79,14 4,12.21 4,10C4,7.79 5.79,6 8,6M8,8A2,2 0 0,0 6,10A2,2 0 0,0 8,12A2,2 0 0,0 10,10A2,2 0 0,0 8,8M8,16C10.67,16 16,17.33 16,20V22H0V20C0,17.33 5.33,16 8,16M8,17.9C5.03,17.9 1.9,19.36 1.9,20V20.1H14.1V20C14.1,19.36 10.97,17.9 8,17.9M16,18C16.67,18 17.33,18.09 18,18.24V22H24V20C24,18.33 21.33,18 20,18H16Z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Travel Community</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Connect with fellow travelers and share amazing experiences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations - Airbnb Style Cards */}
        {recentSearches.length > 0 && (
          <div className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                  Popular destinations
                </h3>
                <p className="text-lg text-gray-600">
                  Discover where other travelers are planning their next adventures
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentSearches.slice(0, 6).map((search: any, index: number) => {
                  const itinerary = search.itinerary?.itinerary?.[0];
                  const displayName = search.destination.split(',')[0];
                  
                  return (
                    <Link
                      key={index}
                      href={`/trip/${search._id}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        {/* Image */}
                        <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                          {itinerary?.imageUrl ? (
                            <img
                              src={itinerary.imageUrl}
                              alt={itinerary.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                              <span className="text-4xl">🌍</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {displayName}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {itinerary?.title || `Explore ${displayName} with AI-powered planning`}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Credit Packages - Clean Cards */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                Choose your plan
              </h3>
              <p className="text-lg text-gray-600">
                Flexible credit packages to power your travel planning
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {ITEMS.map((item, index) => {
                const isPopular = item.bonus && item.bonus > 0;
                
                return (
                  <div key={item.id} className={`relative bg-white rounded-2xl border-2 p-8 ${isPopular ? 'border-rose-200 shadow-lg' : 'border-gray-100'}`}>
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-rose-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-3xl mb-4">{item.icon}</div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.name.replace(/^[📖⭐🌟]\s*/, '')}
                      </h4>
                      <div className="text-3xl font-bold text-gray-900 mb-4">
                        ⭐ {item.price}
                      </div>
                      <div className="mb-6">
                        <p className="text-lg font-medium text-gray-700 mb-1">
                          {item.credits + (item.bonus || 0)} Credits
                        </p>
                        {item.bonus && (
                          <p className="text-sm text-gray-500">
                            ({item.credits} + {item.bonus} bonus)
                          </p>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
                      </p>
                      
                      {item.bonus && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                          <span className="text-rose-600 font-medium text-sm">
                            {Math.round((item.bonus / item.credits) * 100)}% Bonus Credits
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Operation Costs Info */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-xl px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-sm">💡</span>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-medium">Transparent Pricing</p>
                    <p className="text-gray-600 text-sm">
                      {formatCostDisplay(DEFAULT_OPERATION_COSTS.itineraryGeneration.costPerDay)} per day • 
                      PDF export: {formatCostDisplay(DEFAULT_OPERATION_COSTS.export.pdfFile)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA - Clean and Simple */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-4xl font-semibold text-gray-900 mb-6">
              Ready to plan your perfect trip?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who trust AI Travel Planner for their adventures
            </p>
            
            <button
              onClick={handleTelegramLaunch}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 px-12 rounded-lg text-lg font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center gap-3"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #f43f5e)'
              }}
            >
              <span>🚀</span>
              <span>Start Planning Now</span>
            </button>
            
            <p className="text-gray-500 mt-4 text-sm">
              Available exclusively on Telegram
            </p>
          </div>
        </div>
      </main>

      {/* Footer - Clean */}
      <footer className="border-t border-gray-200 bg-white" style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✈️</span>
                </div>
                <h3 className="text-xl font-bold text-rose-500">AI Travel Planner</h3>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Your intelligent travel companion. Plan perfect trips with AI-powered recommendations and seamless organization.
              </p>
              <div className="text-sm text-gray-500">
                © 2025 AI Travel Planner. All rights reserved.
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/credits" className="hover:text-gray-900">Credits</Link></li>
                <li><Link href="/app" className="hover:text-gray-900">Features</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="/help" className="hover:text-gray-900">Help Center</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
