"use client";

import React, { useState } from 'react';
import { SearchHistoryItem, CreditHistoryItem } from '../../types/types';
import { Icon } from '../common/Icon';
import Modal from '../common/Modal';
import RefundInstructionsModal from '../auxiliary/RefundInstructionsModal';
import { useUserStore } from '../../store/userStore';
import { useUIStore } from '../../store/uiStore';
import { useItineraryStore } from '../../store/itineraryStore';
import { usePreferencesStore } from '../../store/preferencesStore';
// Use reactive Convex queries instead of manual refresh
import { useSearchHistory, useCreditHistory, useUserByTelegramId } from '../../hooks/useConvexQueries';
import { Doc } from '../../convex/_generated/dataModel';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'search' | 'credits';

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<{ telegramChargeId: string; purchaseId: string } | null>(null);
  
  const { 
    user,
    userProfile,
    isLoading,
    error 
  } = useUserStore();
  
  // Use reactive Convex queries for real-time data
  const { data: liveUser, isLoading: userLoading } = useUserByTelegramId(user?.telegramId || null);
  const { data: convexSearchHistory = [], isLoading: searchLoading } = useSearchHistory(user?._id || null);
  const { data: convexCreditHistory = [], isLoading: creditLoading } = useCreditHistory(user?._id || null);
  
  // Use live credits from Convex instead of stale userStore credits
  const liveCredits = liveUser?.credits ?? 0;
  
  // Convert Convex data to expected format
  const liveSearchHistory: SearchHistoryItem[] = convexSearchHistory.map((item: Doc<"searchHistory">) => ({
    id: item.createdAt,
    destination: item.destination,
    date: new Date(item.createdAt).toISOString(),
    preferences: {
      destination: item.preferences.destination,
      departureCity: item.preferences.departureCity,
      duration: item.preferences.duration,
      startDate: item.preferences.startDate,
      pace: item.preferences.pace as 'Relaxed' | 'Moderate' | 'Packed',
      group: item.preferences.group as 'Solo' | 'Couple' | 'Family' | 'Friends',
      interests: item.preferences.interests,
      budget: item.preferences.budget || '',
    },
    itinerary: item.itinerary,
  }));

  const liveCreditHistory: CreditHistoryItem[] = convexCreditHistory.map((item: Doc<"creditHistory">) => ({
    id: item.createdAt,
    date: new Date(item.createdAt).toLocaleString(),
    action: item.action,
    amount: item.amount,
    balance: item.balanceAfter,
    purchaseId: item.purchaseId,
    telegramChargeId: item.telegramChargeId,
  }));
  
  const { setItinerary } = useItineraryStore();
  const { setAllPreferences } = usePreferencesStore();
  const { closeProfileModal, setSelectedActivityIndex } = useUIStore();

  const handleBuyCredits = () => {
    // Navigate to credit store page
    window.location.href = '/credit-store';
  };

  const handleViewHistoryItem = (item: SearchHistoryItem) => {
    setItinerary(item.itinerary);
    setAllPreferences(item.preferences);
    setSelectedActivityIndex(0);
    closeProfileModal();
  };

  const handleRefundClick = (telegramChargeId: string, purchaseId: string) => {
    setSelectedRefund({ telegramChargeId, purchaseId });
    setShowRefundModal(true);
  };

  const handleCloseRefundModal = () => {
    setShowRefundModal(false);
    setSelectedRefund(null);
  };

  // Show loading state only if no userProfile at all
  if (!userProfile) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="">
        <div className="w-full max-w-sm mx-auto bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center h-80">
          <div className="text-white text-center">
            <svg className="animate-spin h-6 w-6 text-indigo-400 mb-3 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xs text-gray-300">Loading profile...</p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="w-full max-w-sm mx-auto bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col" style={{maxHeight: '85vh'}}>
        {/* Profile Header */}
        <div className="relative p-4 bg-gradient-to-br from-slate-900 to-indigo-900 flex-shrink-0">
            <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10">
                <Icon name="close" className="w-4 h-4 text-gray-200" />
            </button>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Icon name="user" className="w-6 h-6"/>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">{userProfile.name}</h2>
                    <p className="text-xs text-gray-300">{userProfile.handle} • ID: {userProfile.id}</p>
                </div>
            </div>
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-300">Current balance:</p>
                <p className="text-2xl font-bold text-white my-1.5 flex items-center justify-center gap-1.5">
                    <Icon name="coin" className="w-6 h-6 text-amber-400"/>
                    {isLoading || userLoading ? (
                      <span className="animate-pulse text-base">Loading...</span>
                    ) : (
                      `${liveCredits} credits`
                    )}
                </p>
                <div className="flex gap-1.5 justify-center">
                  <button onClick={handleBuyCredits} className="bg-amber-400 text-amber-900 font-bold py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 hover:bg-amber-300 transition-colors shadow-md text-sm" disabled={isLoading || userLoading}>
                      <Icon name="plus" className="w-4 h-4"/>
                      Buy Credits
                  </button>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="p-1.5 bg-slate-900/50 flex-shrink-0">
          <div className="flex bg-slate-800 p-0.5 rounded-full">
            <TabButton title="Search History" isActive={activeTab === 'search'} onClick={() => setActiveTab('search')} />
            <TabButton title="Credit History" isActive={activeTab === 'credits'} onClick={() => setActiveTab('credits')} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-grow bg-slate-800 p-3 overflow-y-auto relative">
          {/* Show loading overlay when refreshing */}
          {(searchLoading || creditLoading || userLoading) && (
            <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center z-10">
              <div className="text-white text-center">
                <svg className="animate-spin h-5 w-5 text-indigo-400 mb-1.5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xs text-gray-300">Loading...</p>
              </div>
            </div>
          )}
          {/* Show content */}
          {activeTab === 'search' && <SearchHistoryList items={liveSearchHistory} onViewItem={handleViewHistoryItem} />}
          {activeTab === 'credits' && <CreditHistoryList items={liveCreditHistory} onRefund={handleRefundClick} />}
        </div>
      </div>
      
      {/* Refund Instructions Modal */}
      {showRefundModal && selectedRefund && (
        <RefundInstructionsModal
          onClose={handleCloseRefundModal}
          telegramChargeId={selectedRefund.telegramChargeId}
          purchaseId={selectedRefund.purchaseId}
        />
      )}
    </Modal>
  );
};

const TabButton: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({ title, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
        isActive ? 'text-white bg-indigo-600 shadow-md' : 'text-gray-300 hover:bg-white/10'
      }`}
    >
      {title}
    </button>
);

// Search History Components
const SearchHistoryList: React.FC<{ items: SearchHistoryItem[], onViewItem: (item: SearchHistoryItem) => void }> = ({ items, onViewItem }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <Icon name="clock" className="w-8 h-8 mx-auto mb-1.5 opacity-50" />
        <p className="text-sm">No search history yet</p>
        <p className="text-xs mt-0.5">Create your first itinerary to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {[...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(item => <SearchHistoryCard key={item.id} item={item} onClick={() => onViewItem(item)} />)}
    </div>
  );
};

const SearchHistoryCard: React.FC<{ item: SearchHistoryItem, onClick: () => void }> = ({ item, onClick }) => (
  <div onClick={onClick} className="bg-slate-700/50 p-3 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors border border-white/10">
    <div className="flex justify-between items-start">
        <div>
            <h4 className="font-bold text-sm text-white">{item.destination}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className="text-indigo-400 text-xs font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded-full">View</span>
    </div>
    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/10 flex-wrap">
        <PreferenceChip icon="calendar" text={`${item.preferences.duration} days`} />
        <PreferenceChip icon="clock" text={item.preferences.pace} />
        <PreferenceChip icon="users" text={item.preferences.group} />
        {item.preferences.budget && <PreferenceChip icon="coin" text={item.preferences.budget} />}
        <PreferenceChip icon="star" text={item.preferences.interests.split(',')[0]} />
    </div>
  </div>
);

const PreferenceChip: React.FC<{ icon: string, text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-1 text-xs text-gray-300">
        <Icon name={icon} className="w-3 h-3 text-gray-400" />
        <span>{text}</span>
    </div>
);

// Credit History Components
const CreditHistoryList: React.FC<{ items: CreditHistoryItem[]; onRefund: (telegramChargeId: string, purchaseId: string) => void }> = ({ items, onRefund }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <Icon name="coin" className="w-8 h-8 mx-auto mb-1.5 opacity-50" />
        <p className="text-sm">No credit history yet</p>
        <p className="text-xs mt-0.5">Credit transactions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {[...items].sort((a, b) => b.id - a.id).map(item => <CreditHistoryCard key={item.id} item={item} onRefund={onRefund} />)}
    </div>
  );
};

const CreditHistoryCard: React.FC<{ item: CreditHistoryItem; onRefund: (telegramChargeId: string, purchaseId: string) => void }> = ({ item, onRefund }) => {
  const isCredit = item.amount > 0;
  const isPurchase = item.action.toLowerCase().includes('purchase') && item.telegramChargeId && item.purchaseId;
  
  return (
    <div className="flex items-center p-2.5 bg-slate-700/50 rounded-lg border border-white/10">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-2.5 ${isCredit ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        <Icon name={isCredit ? 'plus' : 'receipt'} className="w-4 h-4" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-sm text-white">{item.action}</p>
        <p className="text-xs text-gray-400">{item.date}</p>
      </div>
      <div className="text-right flex items-center gap-2">
        <div>
          <p className={`font-bold text-sm ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
            {isCredit ? `+${item.amount}` : item.amount}
          </p>
          <p className="text-xs text-gray-400">Bal: {item.balance}</p>
        </div>
        {isPurchase && (
          <button
            onClick={() => onRefund(item.telegramChargeId!, item.purchaseId!)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-2 py-1 rounded text-xs font-semibold transition-colors"
          >
            Refund
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
