"use client";

import React, { useEffect, useState } from 'react';
import { convexService } from '../lib/convexService';

interface TelegramAuthGuardProps {
  children: React.ReactNode;
}

const TelegramAuthGuard: React.FC<TelegramAuthGuardProps> = ({ children }) => {
  const [isTelegramUser, setIsTelegramUser] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTelegramAuth = () => {
      try {
        const telegramUser = convexService.getTelegramUser();
        console.log('TelegramAuthGuard: Telegram user check result:', telegramUser);
        
        if (telegramUser) {
          setIsTelegramUser(true);
        } else {
          setIsTelegramUser(false);
        }
      } catch (error) {
        console.error('TelegramAuthGuard: Error checking Telegram user:', error);
        setIsTelegramUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Apply Telegram WebApp theme colors if available
    if (typeof window !== 'undefined') {
      const telegram = (window as any).Telegram;
      if (telegram?.WebApp) {
        telegram.WebApp.ready();
        // Set theme colors for better integration
        document.documentElement.style.setProperty('--tg-theme-bg-color', telegram.WebApp.backgroundColor || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', telegram.WebApp.textColor || '#000000');
      }
    }

    // Check immediately
    checkTelegramAuth();

    // Also check after a short delay to handle cases where Telegram WebApp might load slowly
    const timeoutId = setTimeout(checkTelegramAuth, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isTelegramUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Telegram Access Required
            </h1>
            <p className="text-gray-600 mb-6">
              This AI Travel Planner app is exclusive to Telegram users. Please access this app through Telegram to get started.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">How to access:</h3>
              <ol className="text-sm text-gray-600 text-left space-y-1">
                <li>1. Open Telegram app</li>
                <li>2. Find our bot or mini app</li>
                <li>3. Launch the Travel Planner</li>
                <li>4. Get 10 free credits as welcome bonus!</li>
              </ol>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>New users get 10 free credits</strong> to start planning amazing trips! 🎉
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              AI Travel Planner • Powered by Telegram
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default TelegramAuthGuard;
