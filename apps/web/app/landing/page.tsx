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
import Privacy from '../../components/landing/Privacy';
import TermsOfService from '../../components/landing/TermsOfService';

interface SearchItem {
  destination: string;
  createdAt: number;
}
type Page = 'home' | 'privacy' | 'terms';

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
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
<div className="bg-[#F9FAF8]">
      <Header />
      <main>
        {currentPage === 'home' && (
          <>
            <Hero />
            <Features />
            <Itineraries />
          </>
        )}
        {currentPage === 'privacy' && <Privacy onNavigate={() => navigateTo('home')} />}
        {currentPage === 'terms' && <TermsOfService onNavigate={() => navigateTo('home')} isTelegramApp={!!isTelegram} />}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default LandingPage;
