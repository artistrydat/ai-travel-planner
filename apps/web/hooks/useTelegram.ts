import { useEffect, useState } from 'react';
import type { TelegramWebAppExtended, TelegramUser } from '../types/telegram';

const useTelegram = () => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramData, setTelegramData] = useState<TelegramWebAppExtended | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (!isClientMounted) return;
    
    const checkTelegramAvailability = () => {
      if (typeof window !== 'undefined') {
        const webApp = window.Telegram?.WebApp;
        
        if (webApp) {
          // Initialize Telegram WebApp
          webApp.ready();
          webApp.expand();
          
          // Check for valid initialization data
          const hasValidData = !!(webApp.initData && webApp.initDataUnsafe);
          
          setIsTelegram(hasValidData);
          setTelegramData(webApp);
          
          console.log('Telegram WebApp detected:', {
            initData: !!webApp.initData,
            platform: webApp.platform,
            version: webApp.version,
            user: webApp.initDataUnsafe?.user,
          });
        } else {
          // Additional checks for Telegram context
          const userAgent = navigator.userAgent || '';
          const isTelegramUserAgent = userAgent.includes('Telegram');
          const isInIframe = window !== window.top;
          const hasTelegramParams = new URLSearchParams(window.location.search).has('tgWebAppStartParam');
          
          // Fallback detection for cases where WebApp might not be immediately available
          const isTelegramContext = isTelegramUserAgent || (isInIframe && hasTelegramParams);
          
          setIsTelegram(isTelegramContext);
          setTelegramData(null);
          
          console.log('Telegram WebApp not available, fallback detection:', {
            isTelegramUserAgent,
            isInIframe,
            hasTelegramParams,
            isTelegramContext,
          });
        }
      }
      
      setIsLoading(false);
    };

    // Check immediately
    checkTelegramAvailability();

    // Also check after a delay in case Telegram WebApp loads asynchronously
    const timeoutId = setTimeout(checkTelegramAvailability, 1000);

    return () => clearTimeout(timeoutId);
  }, [isClientMounted]);

  // Helper functions
  const getTelegramUser = () => {
    return telegramData?.initDataUnsafe?.user || null;
  };

  const getInitData = () => {
    return telegramData?.initData || null;
  };

  const showMainButton = (text: string, onClick: () => void) => {
    if (telegramData?.MainButton) {
      telegramData.MainButton.text = text;
      telegramData.MainButton.onClick(onClick);
      telegramData.MainButton.show();
    }
  };

  const hideMainButton = () => {
    if (telegramData?.MainButton) {
      telegramData.MainButton.hide();
    }
  };

  const showBackButton = (onClick: () => void) => {
    if (telegramData?.BackButton) {
      telegramData.BackButton.onClick(onClick);
      telegramData.BackButton.show();
    }
  };

  const hideBackButton = () => {
    if (telegramData?.BackButton) {
      telegramData.BackButton.hide();
    }
  };

  const closeTelegramApp = () => {
    if (telegramData) {
      telegramData.close();
    }
  };

  return {
    isTelegram,
    isLoading,
    telegramData,
    getTelegramUser,
    getInitData,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    closeTelegramApp,
  };
};

export default useTelegram;
