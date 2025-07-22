"use client";

import React from 'react';

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gradient' | 'amber';
  padding?: 'small' | 'medium' | 'large';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  children, 
  className = '',
  background = 'white',
  padding = 'medium',
  maxWidth = 'lg'
}) => {
  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-amber-50 via-white to-rose-50',
    amber: 'bg-gradient-to-br from-amber-50 to-orange-50'
  };

  const paddingClasses = {
    small: 'py-12',
    medium: 'py-20',
    large: 'py-24'
  };

  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <section className={`${backgroundClasses[background]} ${paddingClasses[padding]} relative overflow-hidden ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6`}>
        {children}
      </div>
    </section>
  );
};

export default ContentSection;
