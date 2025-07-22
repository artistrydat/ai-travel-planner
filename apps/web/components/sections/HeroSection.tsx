"use client";

import React from 'react';
import { siteMetadata } from '../../data/metadata';

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-20 pb-32 relative overflow-hidden">
      {/* Background Pattern - Thrillz Inspired */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-amber-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-rose-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-orange-300 rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Text */}
          <div className="text-left max-w-2xl">
            {/* Luxury Badge */}
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full px-6 py-2 mb-8">
              <span className="text-amber-600 font-medium text-sm tracking-wide">
                {siteMetadata.hero.badge}
              </span>
            </div>
            
            {/* Main Headline - Thrillz Style */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              {siteMetadata.hero.headline}
            </h1>
            
            <p className="text-xl text-gray-700 mb-12 leading-relaxed font-light">
              {siteMetadata.hero.description}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
              <button
                onClick={onCtaClick}
                className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 text-white py-4 px-8 rounded-xl text-lg font-medium hover:shadow-2xl transition-all duration-500 flex items-center gap-4 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{siteMetadata.logo}</span>
                <span className="tracking-wide">{siteMetadata.hero.cta}</span>
              </button>
              
              {/* Statistics */}
              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs">👤</span>
                  </div>
                  <div className="w-8 h-8 bg-rose-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs">👤</span>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs">👤</span>
                  </div>
                </div>
                <span className="text-sm font-light">23K+ Satisfied Customers</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 text-gray-700">
              {siteMetadata.hero.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <span className="text-white text-sm font-bold">{stat.icon}</span>
                  </div>
                  <span className="font-light tracking-wide">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual/Interactive Element */}
          <div className="relative">
            {/* Interactive Map-like Component - Thrillz Inspired */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-amber-200/50 relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-rose-500/5 pointer-events-none"></div>
              
              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-light text-gray-800 mb-2">Design Your Bespoke Journey</h3>
                  <p className="text-gray-600 font-light">Curated experiences for the sophisticated traveler</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 tracking-wide uppercase">Destination</label>
                    <div className="p-4 border border-amber-200 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md transition-all duration-300 cursor-pointer">
                      <span className="text-gray-600 font-light">Where shall we take you?</span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700 tracking-wide uppercase">When</label>
                      <div className="p-4 border border-amber-200 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md transition-all duration-300 cursor-pointer">
                        <span className="text-gray-600 font-light">Select dates</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700 tracking-wide uppercase">Who</label>
                      <div className="p-4 border border-amber-200 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md transition-all duration-300 cursor-pointer">
                        <span className="text-gray-600 font-light">Travelers</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={onCtaClick}
                    className="w-full bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 text-white py-4 px-8 rounded-xl text-lg font-light hover:shadow-2xl transition-all duration-500 flex items-center justify-center gap-4 group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">🚀</span>
                    <span className="tracking-wide">Start Adventure</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements - Thrillz Style */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-400/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-rose-400/20 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
