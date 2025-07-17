"use client";

import React from 'react';
import { Icon } from './common/Icon';
import { useUserStore } from '../store/userStore';
import { useUIStore } from '../store/uiStore';
import { useUserByTelegramId } from '../hooks/useConvexQueries';

const Header: React.FC = () => {
  const { user } = useUserStore();
  const { openProfileModal } = useUIStore();
  
  // Use reactive Convex query for live credits
  const { data: liveUser, isLoading: userLoading } = useUserByTelegramId(user?.telegramId || null);
  const liveCredits = liveUser?.credits ?? 0;

  return (
    <header className="w-full flex justify-between items-center pointer-events-auto">
      <div>
         <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-md p-2 pr-4 rounded-full text-white shadow-lg border border-white/10">
            <Icon name="logo" className="w-8 h-8 text-indigo-400"/>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text">VoyageAI</span>
         </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-md px-4 py-2 rounded-full text-white shadow-lg border border-white/10">
          <Icon name="coin" className="w-6 h-6 text-amber-400" />
          <span className="font-bold text-lg">
            {userLoading ? '...' : liveCredits}
          </span>
        </div>
        <button
          onClick={openProfileModal}
          className="bg-gray-900/50 backdrop-blur-md p-2.5 rounded-full text-white shadow-lg hover:bg-white/20 transition-colors border border-white/10"
          aria-label="Open profile"
        >
          <Icon name="user" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
