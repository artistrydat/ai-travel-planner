"use client";

import React from 'react';
import { Icon } from '../common/Icon';
import { useUserStore } from '../../store/userStore';
import { useUIStore } from '../../store/uiStore';
import { useUserByTelegramId } from '../../hooks/useConvexQueries';

const Header: React.FC = () => {
  const { user } = useUserStore();
  const { openProfileModal } = useUIStore();
  
  // Use reactive Convex query for live credits
  const { data: liveUser, isLoading: userLoading } = useUserByTelegramId(user?.telegramId || null);
  const liveCredits = liveUser?.credits ?? 0;

  return (
    <header className="w-full flex justify-between items-center pointer-events-auto px-2 py-1">
      <div>
         <div className="flex items-center gap-1 bg-gray-900/30 backdrop-blur-sm p-1 pr-2 rounded-lg text-white shadow-sm border border-white/5">
            <Icon name="logo" className="w-4 h-4 text-indigo-400"/>
            <span className="font-semibold text-sm bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text">VoyageAI</span>
         </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 bg-gray-900/30 backdrop-blur-sm px-2 py-1 rounded-lg text-white shadow-sm border border-white/5">
          <Icon name="coin" className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-sm">
            {userLoading ? '...' : liveCredits}
          </span>
        </div>
        <button
          onClick={openProfileModal}
          className="bg-gray-900/30 backdrop-blur-sm p-1.5 rounded-lg text-white shadow-sm hover:bg-white/10 transition-colors border border-white/5"
          aria-label="Open profile"
        >
          <Icon name="user" className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
