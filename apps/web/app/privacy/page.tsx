'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Privacy from '../../components/landing/Privacy';

export default function PrivacyPage() {
  const router = useRouter();

  const handleNavigateHome = () => {
    router.push('/');
  };

  return <Privacy onNavigate={handleNavigateHome} />;
}
