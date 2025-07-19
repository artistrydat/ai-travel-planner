'use client';

import { useEffect } from 'react';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

export default function TelegramDebugger() {
  const { webApp, isReady, isTelegram, user, initData } = useTelegramWebApp();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('=== Telegram Debug Info ===');
      console.log('window.Telegram exists:', !!(window as any).Telegram);
      console.log('window.Telegram.WebApp exists:', !!(window as any).Telegram?.WebApp);
      console.log('WebApp object:', (window as any).Telegram?.WebApp);
      console.log('isReady:', isReady);
      console.log('isTelegram:', isTelegram);
      console.log('webApp exists:', !!webApp);
      console.log('initData:', initData);
      console.log('initData length:', initData.length);
      console.log('user:', user);
      console.log('User Agent:', navigator.userAgent);
      console.log('Location:', window.location.href);
      
      // Also check for typical Telegram user agent patterns
      const userAgent = navigator.userAgent;
      const isTelegramUA = userAgent.includes('Telegram') || userAgent.includes('TelegramBot');
      console.log('User Agent contains Telegram:', isTelegramUA);
    }
  }, [webApp, isReady, isTelegram, user, initData]);

  return null;
}
