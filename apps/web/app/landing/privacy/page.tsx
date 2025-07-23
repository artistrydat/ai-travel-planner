'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Privacy from '../../../components/landing/Privacy';

export default function LandingPrivacyPage() {
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

  return <Privacy onNavigate={handleNavigateHome} />;
}
