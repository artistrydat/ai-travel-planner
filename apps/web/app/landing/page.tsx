"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{
      backgroundColor: 'var(--tg-theme-bg-color, #f8fafc)',
      color: 'var(--tg-theme-text-color, #1e293b)'
    }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 9.95 5.16-.212 9-4.4 9-9.95V7l-10-5z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI Travel Planner</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/credits" className="text-gray-600 hover:text-blue-600 transition-colors">
                Credit Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Trip with
            <span className="text-blue-600"> AI Intelligence</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized travel itineraries powered by advanced AI. From hidden gems to must-see attractions, 
            we'll create the perfect plan tailored to your preferences.
          </p>
          
          {/* Primary CTA */}
          <div className="mb-8">
            <button
              onClick={handleTelegramLaunch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2481cc)'
              }}
            >
              🚀 Start Planning on Telegram
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Get 10 free credits to start planning immediately!
            </p>
          </div>

          {/* Free Credits Promotion */}
          <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-full px-6 py-3">
            <span className="text-green-800 font-medium">
              🎉 New users get 10 free credits worth $10
            </span>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V9M19 19H5V3H13V9H19Z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Planning</h3>
            <p className="text-gray-600">
              Advanced AI creates personalized itineraries based on your preferences, budget, and travel style.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Maps</h3>
            <p className="text-gray-600">
              Visualize your entire trip on beautiful interactive maps with photos and detailed location information.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Export & Share</h3>
            <p className="text-gray-600">
              Export your itineraries to PDF or share them with friends. Access offline when you're traveling.
            </p>
          </div>
        </div>

        {/* Popular Destinations */}
        {recentSearches.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Popular Destinations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentSearches.slice(0, 8).map((search: SearchItem, index: number) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <p className="font-medium text-gray-900 text-center">{search.destination}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* App Preview Placeholder */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            See It In Action
          </h3>
          <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">App Interface Preview</p>
              <p className="text-sm text-gray-500">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Adventure?
          </h3>
          <button
            onClick={handleTelegramLaunch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            style={{
              backgroundColor: 'var(--tg-theme-button-color, #2481cc)'
            }}
          >
            Launch AI Travel Planner
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Available exclusively on Telegram
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="font-medium text-gray-900">AI Travel Planner</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/credits" className="text-gray-600 hover:text-blue-600 transition-colors">
                Credit Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2025 AI Travel Planner • Powered by Telegram
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
