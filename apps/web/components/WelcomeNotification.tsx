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
    <div className="fixed top-2 left-2 right-2 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg shadow-lg border border-green-400/20 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm">🎉</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">Welcome, {userName}!</h3>
            <p className="text-green-100 text-xs">
              <strong>10 free credits</strong> to start planning!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeNotification;
