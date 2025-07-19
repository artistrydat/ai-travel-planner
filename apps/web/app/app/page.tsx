"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

/**
 * App route that automatically redirects users based on Telegram detection
 */
const AppRedirectPage: React.FC = () => {
  const router = useRouter();
  const { isTelegram, isReady, webApp } = useTelegramWebApp();

  useEffect(() => {
    if (isReady) {
      if (isTelegram) {
        // Telegram users go to main app
        router.replace('/');
      } else {
        // Non-Telegram users go to landing page
        router.replace('/landing');
      }
    }
  }, [isTelegram, isReady, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default AppRedirectPage;
