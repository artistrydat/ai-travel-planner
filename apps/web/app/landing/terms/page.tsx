'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TermsOfService from '../../../components/landing/TermsOfService';

export default function LandingTermsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigateHome = () => {
    // Check if there's a return URL parameter
    const returnUrl = searchParams.get('return');
    if (returnUrl) {
      router.push(returnUrl);
    } else {
      router.push('/landing');
    }
  };

  return <TermsOfService onNavigate={handleNavigateHome} isTelegramApp={false} />;
}
