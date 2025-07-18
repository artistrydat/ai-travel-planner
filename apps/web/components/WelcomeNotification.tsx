"use client";

import React, { useEffect, useState } from 'react';

interface WelcomeNotificationProps {
  isNewUser: boolean;
  userName?: string;
}

const WelcomeNotification: React.FC<WelcomeNotificationProps> = ({ isNewUser, userName = 'User' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isNewUser) {
      // Show the notification after a brief delay
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      // Hide the notification after 5 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isNewUser]);

  if (!isNewUser || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-green-400/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎉</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Welcome, {userName}!</h3>
            <p className="text-green-100 text-sm">
              You've received <strong>10 free credits</strong> to start planning your adventures!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeNotification;
