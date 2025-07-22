"use client";

import React from 'react';
import Link from 'next/link';
import { siteMetadata } from '../../data/metadata';

interface HeaderProps {
  onCtaClick?: () => void;
  variant?: 'default' | 'minimal';
}

const Header: React.FC<HeaderProps> = ({ onCtaClick, variant = 'default' }) => {
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-amber-100 sticky top-0 z-50" style={{
      backgroundColor: 'var(--tg-theme-bg-color, rgba(255,255,255,0.95))',
      borderColor: 'var(--tg-theme-text-color, rgba(251, 191, 36, 0.2))'
    }}>
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/landing" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300" style={{
              backgroundColor: `var(--tg-theme-button-color, ${siteMetadata.primaryColor})`
            }}>
              <span className="text-white text-lg font-bold">{siteMetadata.logo}</span>
            </div>
            <div>
              <h1 className="text-2xl font-light text-gray-800 tracking-wide group-hover:text-amber-600 transition-colors duration-300">
                {siteMetadata.title}
              </h1>
              <div className="text-xs text-amber-600 font-light tracking-[0.15em] uppercase">
                {siteMetadata.tagline}
              </div>
            </div>
          </Link>

          {/* Navigation */}
          {variant === 'default' ? (
            <nav className="hidden md:flex items-center space-x-10">
              {siteMetadata.navigation.main.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className="text-gray-700 hover:text-amber-600 transition-colors text-sm font-light tracking-wide group relative" 
                  style={{
                    color: 'var(--tg-theme-text-color, #374151)'
                  }}
                  title={item.description}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              <button
                onClick={handleCtaClick}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl text-sm font-light hover:shadow-xl transition-all duration-300 tracking-wide hover:scale-105"
              >
                {siteMetadata.hero.cta}
              </button>
            </nav>
          ) : (
            <nav className="flex items-center space-x-6">
              <Link 
                href="/landing" 
                className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-light tracking-wide"
              >
                ← Back to Home
              </Link>
            </nav>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
