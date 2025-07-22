"use client";

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  headerVariant?: 'default' | 'minimal';
  onHeaderCta?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  headerVariant = 'default',
  onHeaderCta 
}) => {
  return (
    <div className="min-h-screen bg-white" style={{
      backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      color: 'var(--tg-theme-text-color, #000000)'
    }}>
      <Header variant={headerVariant} onCtaClick={onHeaderCta} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
