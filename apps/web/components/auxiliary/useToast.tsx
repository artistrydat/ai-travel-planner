"use client";

import React, { createContext, useContext, useState } from 'react';
import { Toast } from './Toast';

interface ToastContextProps {
  showToast: (props: {
    title: string;
    description: string;
    duration?: number;
    variant?: 'default' | 'destructive' | 'success' | 'info';
  }) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    title: string;
    description: string;
    variant: 'default' | 'destructive' | 'success' | 'info';
  } | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showToast = ({
    title,
    description,
    duration = 3000,
    variant = 'default',
  }: {
    title: string;
    description: string;
    duration?: number;
    variant?: 'default' | 'destructive' | 'success' | 'info';
  }) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setToast({ title, description, variant });

    // Set timeout to hide toast
    const id = setTimeout(() => {
      setToast(null);
    }, duration);
    setTimeoutId(id);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};