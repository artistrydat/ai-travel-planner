import { useEffect, useState } from 'react';
import type { TelegramWebAppExtended, TelegramUser } from '../types/telegram';

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<TelegramWebAppExtended | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializeTelegram = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Call ready() as early as possible - this is critical
        tg.ready();
        
        setWebApp(tg);
        setIsReady(true);
        return true;
      }
      return false;
    };

    // Try immediate initialization
    if (!initializeTelegram()) {
      // If not available, poll for it
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds total
      
      const interval = setInterval(() => {
        attempts++;
        
        if (initializeTelegram() || attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  return {
    webApp,
    isReady,
    // Helper methods - check for actual Telegram environment, not just script availability
    isTelegram: typeof window !== 'undefined' && (
      navigator.userAgent.includes('Telegram') || 
      navigator.userAgent.includes('TelegramBot') ||
      !!(window as any).TelegramWebviewProxy ||
      // Check if webApp has valid user data or initData (indicates real Telegram environment)
      (webApp && webApp.initData && webApp.initData.length > 0) ||
      (webApp && webApp.initDataUnsafe?.user?.id)
    ),
    user: webApp?.initDataUnsafe?.user || null,
    initData: webApp?.initData || '',
    themeParams: webApp?.themeParams || {},
    colorScheme: webApp?.colorScheme || 'light',
  };
}
