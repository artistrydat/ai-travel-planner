'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

interface TelegramGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function TelegramGuard({ 
  children, 
  redirectTo = '/landing',
  fallback = null 
}: TelegramGuardProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isTelegram, isReady, webApp } = useTelegramWebApp();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isReady) return;

    // If not in Telegram environment, redirect
    // Don't require initData as it can be empty in some launch modes
    if (!isTelegram) {
      router.push(redirectTo);
    }
  }, [mounted, isReady, isTelegram, router, redirectTo]);

  // During SSR or before mounting, return fallback
  if (!mounted || !isReady) {
    return fallback;
  }

  // If not in Telegram, don't render children
  if (!isTelegram) {
    return fallback;
  }

  return <>{children}</>;
}
