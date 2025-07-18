"use client";

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider } from "convex/react";
import { convex } from '../../lib/convex';
import ErrorBoundary from '../Error/ErrorBoundary';
import { ConvexErrorBoundary } from '../Error/ConvexErrorBoundary';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          console.error('Query failed:', error);
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false,
        onError: (error) => {
          console.error('Mutation failed:', error);
        },
      },
    },
  }));

  // Add debugging info for Telegram environment
  useEffect(() => {
    console.log('=== Providers Debug Info ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Convex URL:', process.env.NEXT_PUBLIC_CONVEX_URL);
    console.log('Is Telegram WebApp:', typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp);
    console.log('User Agent:', typeof window !== 'undefined' ? navigator.userAgent : 'SSR');
  }, []);

  return (
    <ErrorBoundary>
      <ConvexErrorBoundary>
        <ConvexProvider client={convex}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ConvexProvider>
      </ConvexErrorBoundary>
    </ErrorBoundary>
  );
}
