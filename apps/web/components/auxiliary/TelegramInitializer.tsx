'use client';

import { useEffect } from 'react';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

export default function TelegramInitializer() {
  const { webApp, isReady, isTelegram } = useTelegramWebApp();

  useEffect(() => {
    if (!isReady || !webApp) return;

    // Configure the app appearance
    if (isTelegram) {
      // Expand to full height if possible
      if (!webApp.isExpanded) {
        webApp.expand();
      }

      // Enable closing confirmation for better UX
      webApp.enableClosingConfirmation();
      
      // Enable vertical swipes (unless conflicts with app gestures)
      webApp.enableVerticalSwipes();

      // Set theme colors to match app
      try {
        if (webApp.themeParams.bg_color) {
          webApp.setBackgroundColor(webApp.themeParams.bg_color);
        }
        if (webApp.themeParams.header_bg_color) {
          webApp.setHeaderColor(webApp.themeParams.header_bg_color);
        }
      } catch (error) {
        console.warn('Failed to set Telegram theme colors:', error);
      }
    }
  }, [isReady, webApp, isTelegram]);

  // This component doesn't render anything
  return null;
}
