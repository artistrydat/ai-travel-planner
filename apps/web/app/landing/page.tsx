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

  // Show normal landing page for all users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden" style={{
      backgroundColor: 'var(--tg-theme-bg-color, var(--color-bg))',
      color: 'var(--tg-theme-text-color, var(--color-text-base))'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 9.95 5.16-.212 9-4.4 9-9.95V7l-10-5z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">AI Travel Planner</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10">
                Privacy Policy
              </Link>
              <Link href="/credits" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10">
                Credit Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 text-sm font-medium mb-6">
              ✨ AI-Powered Travel Intelligence
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
              Plan Your Perfect Trip
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              with AI Intelligence
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Get personalized travel itineraries powered by advanced AI. From hidden gems to must-see attractions, 
            we'll create the perfect plan tailored to your preferences.
          </p>
          
          {/* Primary CTA */}
          <div className="mb-12">
            <button
              onClick={handleTelegramLaunch}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-6 px-10 rounded-2xl text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #6366F1)'
              }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-2xl">🚀</span>
              <span className="relative z-10">Start Planning on Telegram</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
            </button>
            <p className="text-sm text-gray-400 mt-4">
              Get 10 free credits to start planning immediately!
            </p>
          </div>

          {/* Enhanced Free Credits Promotion */}
          <div className="inline-flex items-center bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40 rounded-2xl px-8 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">⭐</div>
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold text-white">10</div>
              </div>
              <span className="text-emerald-300 font-bold text-lg">
                New users get 10 free credits worth $10
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 text-center border border-white/10 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V9M19 19H5V3H13V9H19Z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">AI-Powered Planning</h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced AI creates personalized itineraries based on your preferences, budget, and travel style.
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 text-center border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-200 transition-colors">Interactive Maps</h3>
              <p className="text-gray-300 leading-relaxed">
                Visualize your entire trip on beautiful interactive maps with photos and detailed location information.
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 text-center border border-white/10 backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-200 transition-colors">Export & Share</h3>
              <p className="text-gray-300 leading-relaxed">
                Export your itineraries to PDF or share them with friends. Access offline when you're traveling.
              </p>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        {recentSearches.length > 0 && (
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Popular Destinations
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentSearches.slice(0, 8).map((search: SearchItem, index: number) => {
                const gradients = [
                  'from-purple-500 to-pink-600',
                  'from-cyan-500 to-blue-600',
                  'from-emerald-500 to-teal-600',
                  'from-orange-500 to-red-600'
                ];
                const gradient = gradients[index % gradients.length];
                
                // Create a slug from destination name
                const slug = search.destination.toLowerCase()
                  .replace(/[^a-z0-9\s]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/--+/g, '-')
                  .trim()
                  .substring(0, 20);
                
                // Simplified destination name for display
                const displayName = search.destination.split(',')[0];
                
                return (
                  <Link 
                    key={index} 
                    href={`/destination/${slug === 'kuta-selatan-south' ? 'bali' : slug === 'dubai' ? 'dubai' : slug}`}
                    className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-xl">🌍</span>
                      </div>
                      <p className="font-bold text-white text-center group-hover:text-gray-200 transition-colors text-sm leading-tight">
                        {displayName}
                      </p>
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        <p className="text-xs text-gray-400 text-center mt-2">Click to explore</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Credit Packages Preview */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Choose Your Adventure Level
            </span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {ITEMS.map((item, index) => {
              const gradients = [
                { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-400/40', accent: 'text-purple-300', icon: 'from-purple-500 to-pink-600' },
                { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-400/40', accent: 'text-cyan-300', icon: 'from-cyan-500 to-blue-600' },
                { bg: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-400/40', accent: 'text-emerald-300', icon: 'from-emerald-500 to-green-600' }
              ];
              const style = gradients[index % gradients.length];
              const isPopular = item.bonus && item.bonus > 0;
              
              return (
                <div key={item.id} className={`group relative bg-gradient-to-br ${style.bg} rounded-3xl p-8 border ${style.border} backdrop-blur-xl hover:border-opacity-80 transition-all duration-500 hover:scale-105 ${isPopular ? 'scale-105 ring-2 ring-amber-400/30' : ''}`}>
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      POPULAR
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${style.icon} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">{item.name.replace(/^[📖⭐🌟]\s*/, '')}</h4>
                    <p className={`text-3xl font-bold ${style.accent} mb-4`}>⭐ {item.price}</p>
                    <div className="mb-6">
                      <p className={`${style.accent} text-sm mb-1`}>
                        {item.credits + (item.bonus || 0)} Credits
                      </p>
                      {item.bonus && (
                        <p className="text-xs text-gray-300">
                          ({item.credits} + {item.bonus} bonus)
                        </p>
                      )}
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                      {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                    </p>
                    <div className={`bg-gradient-to-r ${style.bg} border ${style.border} rounded-xl p-3`}>
                      <span className={`${style.accent} font-medium text-sm`}>
                        {item.bonus ? `${Math.round((item.bonus / item.credits) * 100)}% Bonus` : 'Essential Planning'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Operation Costs Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/40 rounded-2xl px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">💡</span>
                </div>
                <div className="text-left">
                  <p className="text-indigo-300 font-medium">Smart Pricing</p>
                  <p className="text-indigo-200 text-sm">
                    {formatCostDisplay(DEFAULT_OPERATION_COSTS.itineraryGeneration.costPerDay)} per day • 
                    PDF export: {formatCostDisplay(DEFAULT_OPERATION_COSTS.export.pdfFile)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced App Preview Section */}
        <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-3xl p-12 border border-white/10 backdrop-blur-xl mb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                See It In Action
              </span>
            </h3>
            
            {/* Mock Interface Preview */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
              {/* Mock Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
                    <span className="text-white font-bold">AI Travel Planner</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Mock Content */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Side - Itinerary Preview */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      5-Day Bali Adventure
                    </h4>
                    
                    <div className="space-y-4">
                      {[
                        { day: 'Day 1', title: 'Uluwatu Temple & Kecak Dance', time: '15:00', color: 'from-purple-500 to-pink-600' },
                        { day: 'Day 2', title: 'Water Sports at Tanjung Benoa', time: '09:00', color: 'from-cyan-500 to-blue-600' },
                        { day: 'Day 3', title: 'Hidden Beach Discovery', time: '09:30', color: 'from-emerald-500 to-teal-600' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-slate-600/50 to-slate-700/50 border border-white/10">
                          <div className={`w-3 h-3 bg-gradient-to-r ${item.color} rounded-full`}></div>
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{item.title}</p>
                            <p className="text-gray-400 text-xs">{item.day} • {item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Side - Features */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">✨</span>
                      AI Features
                    </h4>
                    
                    <div className="space-y-4">
                      {[
                        { icon: '🎯', title: 'Personalized Recommendations', desc: 'Based on your preferences' },
                        { icon: '🗺️', title: 'Interactive Maps', desc: 'Visual trip planning' },
                        { icon: '📱', title: 'Export & Share', desc: 'PDF, calendar integration' }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-600/30 to-slate-700/30">
                          <span className="text-lg">{feature.icon}</span>
                          <div>
                            <p className="text-white font-medium text-sm">{feature.title}</p>
                            <p className="text-gray-400 text-xs">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Mock Action Button */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium">
                    <span className="text-lg">🚀</span>
                    Generate My Itinerary
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-center text-gray-400 mt-6">
              Experience seamless AI-powered travel planning
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
              Ready to Start Your Adventure?
            </span>
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust AI Travel Planner for their perfect trips
          </p>
          <button
            onClick={handleTelegramLaunch}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-6 px-12 rounded-2xl text-xl transition-all duration-500 transform hover:scale-105 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40"
            style={{
              backgroundColor: 'var(--tg-theme-button-color, #6366F1)'
            }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-2xl">✈️</span>
            <span className="relative z-10">Launch AI Travel Planner</span>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
          </button>
          <p className="text-sm text-gray-400 mt-4">
            Available exclusively on Telegram
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/60 backdrop-blur-xl border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="font-bold text-white text-lg">AI Travel Planner</span>
            </div>
            <div className="flex space-x-8">
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                Privacy Policy
              </Link>
              <Link href="/credits" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                Credit Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-white/10">
            <p className="text-gray-400">
              © 2025 AI Travel Planner • Powered by Telegram • Made with ❤️ for travelers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
