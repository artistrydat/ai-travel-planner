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
    <div className="min-h-screen bg-white" style={{
      backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      color: 'var(--tg-theme-text-color, #000000)'
    }}>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white" style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
      }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center" style={{
                backgroundColor: 'var(--tg-theme-button-color, #2563eb)'
              }}>
                <span className="text-white text-sm">🤖</span>
              </div>
              <h1 className="text-lg font-semibold" style={{
                color: 'var(--tg-theme-text-color, #000000)'
              }}>AI Travel Planner</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm" style={{
                color: 'var(--tg-theme-text-color, #6b7280)'
              }}>
                Privacy Policy
              </Link>
              <Link href="/credits" className="text-gray-600 hover:text-gray-900 transition-colors text-sm" style={{
                color: 'var(--tg-theme-text-color, #6b7280)'
              }}>
                Credit Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium" style={{
              backgroundColor: 'var(--tg-theme-button-color, #dbeafe)',
              color: 'var(--tg-theme-text-color, #1d4ed8)'
            }}>
              ✨ AI-Powered Travel Intelligence
            </span>
          </div>
          
          {/* Hero Title */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-4" style={{
              color: 'var(--tg-theme-text-color, #111827)'
            }}>
              Plan Your Perfect Trip
              <br />
              <span className="text-blue-600" style={{
                color: 'var(--tg-theme-button-color, #2563eb)'
              }}>with AI Intelligence</span>
            </h2>
          </div>
          
          {/* Description */}
          <div className="mb-12">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{
              color: 'var(--tg-theme-text-color, #6b7280)'
            }}>
              Get personalized travel itineraries powered by advanced AI. From hidden gems to must-see attractions, 
              we'll create the perfect plan tailored to your preferences.
            </p>
          </div>
          
          {/* Primary CTA */}
          <div className="mb-12">
            <button
              onClick={handleTelegramLaunch}
              className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors shadow-lg"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2563eb)'
              }}
            >
              <span>🚀</span>
              <span>Start Planning on Telegram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
              </svg>
            </button>
            
            {/* Credit info */}
            <div className="mt-6">
              <p className="text-green-600 font-semibold text-lg bg-green-50 rounded-lg px-6 py-3 border border-green-200 inline-block">
                💎 Get 10 free credits to start planning immediately!
              </p>
            </div>
          </div>

          {/* Free Credits Promotion */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-6" style={{
            backgroundColor: 'var(--tg-theme-bg-color, #f9fafb)',
            borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
          }}>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-lg">⭐</div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg font-bold">10</div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">💎</div>
              </div>
              
              <div className="text-center">
                <span className="text-green-600 font-bold text-xl">New users get 10 free credits</span>
                <div className="text-green-700 font-bold text-lg">worth $10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* AI-Powered Planning Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow" style={{
            backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
            borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
          }}>
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V9M19 19H5V3H13V9H19Z"/>
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold mb-3" style={{
              color: 'var(--tg-theme-text-color, #111827)'
            }}>AI-Powered Planning</h3>
            
            <p className="text-gray-600" style={{
              color: 'var(--tg-theme-text-color, #6b7280)'
            }}>
              Advanced AI creates personalized itineraries based on your preferences, budget, and travel style.
            </p>
          </div>

          {/* Interactive Maps Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow" style={{
            backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
            borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
          }}>
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,21L9,18.9L15,21L20.64,19.1C20.85,19.03 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z"/>
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold mb-3" style={{
              color: 'var(--tg-theme-text-color, #111827)'
            }}>Interactive Maps</h3>
            
            <p className="text-gray-600" style={{
              color: 'var(--tg-theme-text-color, #6b7280)'
            }}>
              Visualize your entire trip on beautiful interactive maps with photos and detailed location information.
            </p>
          </div>

          {/* Export & Share Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow" style={{
            backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
            borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
          }}>
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold mb-3" style={{
              color: 'var(--tg-theme-text-color, #111827)'
            }}>Export & Share</h3>
            
            <p className="text-gray-600" style={{
              color: 'var(--tg-theme-text-color, #6b7280)'
            }}>
              Export your itineraries to PDF or share them with friends. Access offline when you're traveling.
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentSearches.slice(0, 6).map((search: any, index: number) => {
                // Use itinerary preview if available
                const itinerary = search.itinerary?.itinerary?.[0];
                const gradients = [
                  'from-purple-500 to-pink-600',
                  'from-cyan-500 to-blue-600',
                  'from-emerald-500 to-teal-600',
                  'from-orange-500 to-red-600'
                ];
                const gradient = gradients[index % gradients.length];
                const displayName = search.destination.split(',')[0];
                return (
                  <Link
                    key={index}
                    href={`/trip/${search._id}`}
                    className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105 cursor-pointer"
                  >
                    {/* Card Container with Glass Effect */}
                    <div className="relative bg-slate-800/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-white/10">
                      
                      {/* Background Image with Overlay */}
                      {itinerary?.imageUrl && (
                        <div className="absolute inset-0">
                          <img
                            src={itinerary.imageUrl}
                            alt={itinerary.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                        </div>
                      )}
                      
                      {/* Animated Background for Cards Without Images */}
                      {!itinerary?.imageUrl && (
                        <div className="absolute inset-0">
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-20`}></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="relative z-10 p-8 h-80 flex flex-col justify-between">
                        
                        {/* Top Section */}
                        <div className="text-center">
                          <div className="relative mb-6">
                            <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                              <span className="text-2xl">🌍</span>
                            </div>
                            <div className="absolute -inset-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                          </div>
                          
                          <h4 className="font-bold text-white text-xl leading-tight mb-3 group-hover:text-gray-100 transition-colors">
                            {displayName}
                          </h4>
                          
                          {/* Itinerary Preview */}
                          {itinerary && (
                            <div className="mb-4">
                              <p className="text-gray-200 text-sm font-medium mb-2 truncate group-hover:text-white transition-colors">
                                {itinerary.title}
                              </p>
                              <div className="flex items-center justify-center space-x-2 text-xs text-gray-300">
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                  Day {itinerary.day}
                                </span>
                                <span>•</span>
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                  {itinerary.startTime}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Bottom Section */}
                        <div className="text-center">
                          {/* Hover Effect Line */}
                          <div className="w-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-4 transition-all duration-500 group-hover:w-full"></div>
                          
                          {/* Call to Action */}
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-xs text-white font-medium">
                              ✨ View Full Itinerary
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating Elements */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                        </svg>
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

        {/* Enhanced Final CTA - UIVERSE Style */}
        <div className="text-center relative">
          {/* Floating background elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          {/* Enhanced title */}
          <div className="relative mb-6">
            <h3 className="text-4xl font-bold relative z-10">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 inline-block">
                Ready to Start Your Adventure?
              </span>
            </h3>
            {/* Animated elements */}
            <div className="absolute -top-4 left-1/4 w-6 h-6 text-2xl animate-bounce delay-100">✈️</div>
            <div className="absolute -top-2 right-1/4 w-6 h-6 text-2xl animate-bounce delay-300">🌟</div>
            <div className="absolute top-2 left-1/6 w-6 h-6 text-xl animate-bounce delay-500">🗺️</div>
          </div>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of travelers who trust AI Travel Planner for their perfect trips
          </p>
          
          {/* Enhanced final CTA button */}
          <div className="relative mb-6">
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-20 border border-indigo-400/30 rounded-full animate-ping opacity-30"></div>
              <div className="absolute w-32 h-16 border border-purple-400/40 rounded-full animate-ping delay-500 opacity-40"></div>
            </div>
            
            <button
              onClick={handleTelegramLaunch}
              className="cta-button relative group inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-8 px-16 rounded-3xl text-xl transition-all duration-500 transform hover:scale-110 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/50 border-2 border-transparent hover:border-white/30"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #6366F1)'
              }}
            >
              {/* Multiple layered backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Button content with enhanced animations */}
              <div className="relative z-10 flex items-center gap-4">
                <div className="relative">
                  <span className="text-4xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">✈️</span>
                  <div className="absolute inset-0 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur animate-pulse"></div>
                </div>
                
                <span className="tracking-wide text-2xl font-extrabold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                  Launch AI Travel Planner
                </span>
                
                {/* Enhanced animated arrow */}
                <div className="transition-all duration-500 group-hover:translate-x-2 group-hover:scale-125">
                  <svg className="w-8 h-8 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                  </svg>
                </div>
              </div>
              
              {/* Enhanced ripple effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-active:opacity-40 bg-white transition-opacity duration-200"></div>
              
              {/* Particle burst on click */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-active:opacity-100 group-active:animate-ping"></div>
              </div>
            </button>
          </div>
          
          {/* Enhanced availability text */}
          <div className="relative">
            <p className="text-gray-400 relative z-10 bg-black/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-600/30 inline-block">
              <span className="animate-pulse">📱</span> Available exclusively on Telegram
            </p>
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl blur"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16" style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
      }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center" style={{
                backgroundColor: 'var(--tg-theme-button-color, #2563eb)'
              }}>
                <span className="text-white text-xs">🤖</span>
              </div>
              <span className="font-medium" style={{
                color: 'var(--tg-theme-text-color, #111827)'
              }}>AI Travel Planner</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm" style={{
                color: 'var(--tg-theme-text-color, #6b7280)'
              }}>
                Privacy Policy
              </Link>
              <Link href="/credits" className="text-gray-600 hover:text-gray-900 transition-colors text-sm" style={{
                color: 'var(--tg-theme-text-color, #6b7280)'
              }}>
                Credit Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-gray-200" style={{
            borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
          }}>
            <p className="text-gray-500 text-sm" style={{
              color: 'var(--tg-theme-text-color, #6b7280)'
            }}>
              © 2025 AI Travel Planner • Powered by Telegram • Made with ❤️ for travelers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
