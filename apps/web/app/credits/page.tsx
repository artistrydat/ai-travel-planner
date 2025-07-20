"use client";

import Link from 'next/link';
import { useEffect } from 'react';

const CreditPolicyPage: React.FC = () => {
  useEffect(() => {
    // Apply Telegram WebApp theme colors if available
    if (typeof window !== 'undefined') {
      const telegram = (window as any).Telegram;
      if (telegram?.WebApp) {
        telegram.WebApp.ready();
        // Set theme colors for better integration
        document.documentElement.style.setProperty('--tg-theme-bg-color', telegram.WebApp.backgroundColor || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', telegram.WebApp.textColor || '#000000');
        document.documentElement.style.setProperty('--tg-theme-button-color', telegram.WebApp.buttonColor || '#2481cc');
      }
    }

    // Add enhanced UIVERSE animations for credits
    const style = document.createElement('style');
    style.textContent = `
      @keyframes coin-flip {
        0% { transform: rotateY(0deg); }
        50% { transform: rotateY(180deg); }
        100% { transform: rotateY(360deg); }
      }
      @keyframes golden-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
        50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.8); }
      }
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
      }
      .coin-animation {
        animation: coin-flip 4s ease-in-out infinite;
      }
      .golden-glow {
        animation: golden-glow 3s ease-in-out infinite;
      }
      .sparkle-animation {
        animation: sparkle 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden" style={{
      backgroundColor: 'var(--tg-theme-bg-color, var(--color-bg))',
      color: 'var(--tg-theme-text-color, var(--color-text-base))'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/15 to-orange-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xl">🤖</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">AI Travel Planner</h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/landing" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10">
                Home
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content - UIVERSE Style */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative group">
          {/* Floating golden glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 golden-glow"></div>
          
          <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-16 border border-white/10 hover:border-amber-400/30 transition-all duration-500">
            {/* Enhanced Header Section */}
            <div className="text-center mb-12 relative">
              {/* Floating sparkles */}
              <div className="absolute -top-4 left-1/4 w-3 h-3 bg-amber-400 rounded-full sparkle-animation delay-100">✨</div>
              <div className="absolute -top-2 right-1/3 w-2 h-2 bg-orange-400 rounded-full sparkle-animation delay-300">⭐</div>
              <div className="absolute top-2 left-1/6 w-2.5 h-2.5 bg-yellow-400 rounded-full sparkle-animation delay-500">💫</div>
              <div className="absolute top-4 right-1/5 w-2 h-2 bg-amber-300 rounded-full sparkle-animation delay-700">✨</div>
              
              {/* Enhanced coin icon */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-2xl golden-glow"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl coin-animation hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">⭐</span>
                </div>
                {/* Orbiting coins */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-spin text-sm">💰</div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce text-xs">💎</div>
              </div>
              
              {/* Enhanced title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 relative">
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 inline-block">
                  Credit Policy
                </span>
                {/* Animated underline */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-1000 group-hover:w-32"></div>
              </h1>
              
              <div className="relative">
                <p className="text-gray-300 text-lg backdrop-blur-sm bg-black/20 rounded-2xl px-6 py-3 border border-amber-400/20">
                  <span className="animate-pulse">💫</span> Last updated: July 19, 2025
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent rounded-2xl blur"></div>
              </div>
            </div>

          <div className="space-y-8">
            {/* Enhanced "What Are Credits?" Section */}
            <section className="group relative overflow-hidden">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur animate-pulse"></div>
              
              <div className="relative flex items-start gap-6 p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-amber-400/30 hover:scale-[1.02]">
                {/* Floating particles around icon */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Enhanced icon */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 coin-animation">
                    <svg className="w-7 h-7 text-white group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7A1,1 0 0,0 14,8H18A1,1 0 0,0 19,7V5.73C18.4,5.39 18,4.74 18,4A2,2 0 0,1 20,2A2,2 0 0,1 22,4C22,4.74 21.6,5.39 21,5.73V7A3,3 0 0,1 18,10H14A3,3 0 0,1 11,7V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7,10A2,2 0 0,1 9,12A2,2 0 0,1 7,14A2,2 0 0,1 5,12A2,2 0 0,1 7,10M17,10A2,2 0 0,1 19,12A2,2 0 0,1 17,14A2,2 0 0,1 15,12A2,2 0 0,1 17,10M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10Z"/>
                    </svg>
                  </div>
                  {/* Sparkle effect */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 sparkle-animation">✨</div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">What Are Credits?</h3>
                  <p className="text-gray-300 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors">
                    Credits are our digital currency that powers your AI travel planning experience. Each action consumes credits to provide you with personalized, high-quality travel recommendations.
                  </p>
                  
                  {/* Enhanced promotion box */}
                  <div className="relative group/promo">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-400/30 hover:border-amber-300/50 transition-all duration-300">
                      <p className="text-amber-200 text-sm font-medium flex items-center">
                        <span className="w-3 h-3 bg-amber-400 rounded-full mr-3 animate-pulse flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </span>
                        <span className="animate-pulse">🎁</span> Start with 10 free credits when you join through Telegram!
                        <span className="ml-2 animate-bounce">💰</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
            </section>

            {/* Enhanced Credit Usage Section */}
            <section className="group relative overflow-hidden">
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur animate-pulse"></div>
              
              <div className="relative flex items-start gap-6 p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-emerald-400/30 hover:scale-[1.02]">
                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Enhanced icon */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,3H5C3.9,3 3,3.9 3,5V9H5V5H19V19H5V15H3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.9 20.1,3 19,3M10.08,15.58L11.5,17L16.5,12L11.5,7L10.08,8.41L12.67,11H3V13H12.67L10.08,15.58Z"/>
                    </svg>
                  </div>
                  {/* Success indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">Credit Usage</h3>
                  <p className="text-gray-300 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors">
                    Different actions consume different amounts of credits based on the computational complexity and AI processing required.
                  </p>
                  
                  {/* Enhanced usage table */}
                  <div className="space-y-3">
                    <div className="group/item relative bg-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-emerald-500/10 transition-all duration-300 border border-transparent hover:border-emerald-400/30">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-emerald-400/20 rounded-full flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform duration-300">
                          <span className="text-xs">1️⃣</span>
                        </span>
                        <span className="text-gray-300 text-sm group-hover/item:text-white transition-colors">Generate 1-day itinerary</span>
                      </div>
                      <span className="text-emerald-400 font-bold flex items-center">
                        1 credit <span className="ml-1 animate-bounce">⭐</span>
                      </span>
                    </div>
                    
                    <div className="group/item relative bg-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-emerald-500/10 transition-all duration-300 border border-transparent hover:border-emerald-400/30">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-emerald-400/20 rounded-full flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform duration-300">
                          <span className="text-xs">5️⃣</span>
                        </span>
                        <span className="text-gray-300 text-sm group-hover/item:text-white transition-colors">Generate 5-day itinerary</span>
                      </div>
                      <span className="text-emerald-400 font-bold flex items-center">
                        5 credits <span className="ml-1 animate-bounce delay-100">⭐</span>
                      </span>
                    </div>
                    
                    <div className="group/item relative bg-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-emerald-500/10 transition-all duration-300 border border-transparent hover:border-emerald-400/30">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-emerald-400/20 rounded-full flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform duration-300">
                          <span className="text-xs">📄</span>
                        </span>
                        <span className="text-gray-300 text-sm group-hover/item:text-white transition-colors">Export to PDF</span>
                      </div>
                      <span className="text-emerald-400 font-bold flex items-center">
                        1 credit <span className="ml-1 animate-bounce delay-200">⭐</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
            </section>

            {/* Enhanced Credit Packages Section */}
            <section className="group relative overflow-hidden">
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur animate-pulse"></div>
              
              <div className="relative flex items-start gap-6 p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-blue-400/30 hover:scale-[1.02]">
                {/* Floating particles */}
                <div className="absolute top-6 left-6 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-10 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Enhanced icon */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                    </svg>
                  </div>
                  {/* Info indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse">
                    <span className="text-xs text-white">💡</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">Credit Packages</h3>
                  <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">
                    Choose from our flexible credit packages to match your travel planning needs.
                  </p>
                  
                  {/* Enhanced package cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Starter Pack */}
                    <div className="group/card relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl blur opacity-0 group-hover/card:opacity-60 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-purple-300 font-bold">Starter Pack</h4>
                          <span className="text-lg animate-bounce">🌟</span>
                        </div>
                        <p className="text-white text-2xl font-bold mb-1 flex items-center">
                          25 <span className="ml-1 text-yellow-400">⭐</span>
                        </p>
                        <p className="text-purple-200 text-xs">Perfect for weekend trips</p>
                        {/* Hover shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-700 ease-out"></div>
                      </div>
                    </div>
                    
                    {/* Explorer Pack - Popular */}
                    <div className="group/card relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover/card:opacity-60 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border border-cyan-400/30 hover:border-cyan-300/50 transition-all duration-300 hover:scale-105">
                        {/* Popular badge */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          <span className="animate-pulse">🔥</span> POPULAR
                        </div>
                        <div className="flex items-center justify-between mb-2 mt-2">
                          <h4 className="text-cyan-300 font-bold">Explorer Pack</h4>
                          <span className="text-lg animate-bounce delay-100">🚀</span>
                        </div>
                        <p className="text-white text-2xl font-bold mb-1 flex items-center">
                          75 <span className="ml-1 text-yellow-400">⭐</span>
                        </p>
                        <p className="text-cyan-200 text-xs">Best for multi-city adventures</p>
                        {/* Enhanced glow for popular */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-cyan-400/20 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        {/* Hover shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-700 ease-out"></div>
                      </div>
                    </div>
                    
                    {/* Wanderer Pack */}
                    <div className="group/card relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-xl blur opacity-0 group-hover/card:opacity-60 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-4 border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-emerald-300 font-bold">Wanderer Pack</h4>
                          <span className="text-lg animate-bounce delay-200">🌍</span>
                        </div>
                        <p className="text-white text-2xl font-bold mb-1 flex items-center">
                          200 <span className="ml-1 text-yellow-400">⭐</span>
                        </p>
                        <p className="text-emerald-200 text-xs">Ultimate travel planning</p>
                        {/* Hover shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-700 ease-out"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
            </section>

            {/* Enhanced Refund Policy Section */}
            <section className="group relative overflow-hidden">
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur animate-pulse"></div>
              
              <div className="relative flex items-start gap-6 p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-rose-400/30 hover:scale-[1.02]">
                {/* Floating particles */}
                <div className="absolute top-5 right-5 w-2 h-2 bg-rose-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-5 right-10 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Enhanced icon */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                    </svg>
                  </div>
                  {/* Shield indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-xs text-white">🛡️</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-rose-300 transition-colors">Refund Policy</h3>
                  <p className="text-gray-300 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors">
                    We stand behind our service quality and offer flexible refund options for unused credits.
                  </p>
                  
                  {/* Enhanced policy list */}
                  <ul className="text-gray-400 space-y-3 text-sm">
                    <li className="group/item flex items-center p-2 rounded-lg hover:bg-rose-500/10 transition-all duration-300">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 group-hover/item:animate-pulse"></span>
                      <span className="group-hover/item:text-rose-200 transition-colors">Full refund within 7 days for unused credits</span>
                      <span className="ml-2 opacity-0 group-hover/item:opacity-100 transition-opacity">✅</span>
                    </li>
                    <li className="group/item flex items-center p-2 rounded-lg hover:bg-rose-500/10 transition-all duration-300">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 group-hover/item:animate-pulse"></span>
                      <span className="group-hover/item:text-rose-200 transition-colors">Partial refund for technical issues</span>
                      <span className="ml-2 opacity-0 group-hover/item:opacity-100 transition-opacity">⚡</span>
                    </li>
                    <li className="group/item flex items-center p-2 rounded-lg hover:bg-rose-500/10 transition-all duration-300">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 group-hover/item:animate-pulse"></span>
                      <span className="group-hover/item:text-rose-200 transition-colors">No refund for consumed credits after 30 days</span>
                      <span className="ml-2 opacity-0 group-hover/item:opacity-100 transition-opacity">📅</span>
                    </li>
                  </ul>
                </div>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
            </section>
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-16 pt-12 border-t border-white/10 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-3xl"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to start planning your next adventure?
                </h3>
                <p className="text-gray-300 mb-8">
                  Get started with your 10 free credits and discover amazing destinations
                </p>
                <Link 
                  href="/landing"
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40"
                  style={{
                    backgroundColor: 'var(--tg-theme-button-color, #6366F1)'
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="text-xl">🚀</span>
                  <span className="relative z-10">Get Started with 10 Free Credits</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
                </Link>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>      {/* Enhanced Footer */}
      <footer className="relative z-10 bg-slate-900/60 backdrop-blur-xl border-t border-white/10 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <span className="font-bold text-white text-lg">AI Travel Planner</span>
            </div>
            <div className="flex space-x-8">
              <Link href="/landing" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                Home
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                Privacy Policy
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

export default CreditPolicyPage;
