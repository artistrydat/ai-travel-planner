'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TermsOfService from '../../components/landing/TermsOfService';

export default function TermsPage() {
  const router = useRouter();

  const handleNavigateHome = () => {
    router.push('/');
  };

  return <TermsOfService onNavigate={handleNavigateHome} isTelegramApp={false} />;
}
