"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import Header from '../../components/landing/Header';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import Itineraries from '../../components/landing/Itineraries';
import Footer from '../../components/landing/Footer';

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
    <div className="bg-[#F9FAF8]">
      <Header />
      <main>
        <Hero />
        <Features />
        <Itineraries />
      </main>
      <Footer useDirectLinks={true} />
    </div>
  );
};

export default LandingPage;
