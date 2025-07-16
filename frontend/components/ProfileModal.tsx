"use client";

import React, { useState } from 'react';
import { SearchHistoryItem, CreditHistoryItem, UserProfile } from '../types';
import { Icon } from './common/Icon';
import Modal from './common/Modal';
import { useUserStore } from '../store/userStore';
import { useUIStore } from '../store/uiStore';
import { useItineraryStore } from '../store/itineraryStore';
import { usePreferencesStore } from '../store/preferencesStore';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'search' | 'credits';

const MOCK_USER_PROFILE: UserProfile = {
  name: 'Muhanned',
  handle: '@malmusfer',
  id: '976417275',
};

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const { credits, searchHistory, creditHistory, addCredits, addCreditHistoryItem } = useUserStore();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col" style={{maxHeight: '90vh'}}>
        {/* Profile Header */}
        <div className="relative p-6 bg-gradient-to-br from-slate-900 to-indigo-900 flex-shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10">
                <Icon name="close" className="w-5 h-5 text-gray-200" />
            </button>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Icon name="user" className="w-8 h-8"/>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">{MOCK_USER_PROFILE.name}</h2>
                    <p className="text-sm text-gray-300">{MOCK_USER_PROFILE.handle} &bull; ID: {MOCK_USER_PROFILE.id}</p>
                </div>
            </div>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-300">Your current balance is:</p>
                <p className="text-4xl font-bold text-white my-2 flex items-center justify-center gap-2">
                    <Icon name="coin" className="w-10 h-10 text-amber-400"/>
                    {credits} credits
                </p>
                <button onClick={handleBuyCredits} className="mt-2 bg-amber-400 text-amber-900 font-bold py-2 px-5 rounded-full flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors mx-auto shadow-md">
                    <Icon name="plus" className="w-5 h-5"/>
                    Buy Credits
                </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="p-2 bg-slate-900/50 flex-shrink-0">
          <div className="flex bg-slate-800 p-1 rounded-full">
            <TabButton title="Search History" isActive={activeTab === 'search'} onClick={() => setActiveTab('search')} />
            <TabButton title="Credit History" isActive={activeTab === 'credits'} onClick={() => setActiveTab('credits')} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-grow bg-slate-800 p-4 overflow-y-auto">
          {activeTab === 'search' && <SearchHistoryList items={searchHistory} onViewItem={handleViewHistoryItem} />}
          {activeTab === 'credits' && <CreditHistoryList items={creditHistory} />}
        </div>
      </div>
    </Modal>
  );
};

const TabButton: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({ title, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-center text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
        isActive ? 'text-white bg-indigo-600 shadow-md' : 'text-gray-300 hover:bg-white/10'
      }`}
    >
      {title}
    </button>
);

// Search History Components
const SearchHistoryList: React.FC<{ items: SearchHistoryItem[], onViewItem: (item: SearchHistoryItem) => void }> = ({ items, onViewItem }) => (
  <div className="space-y-3">
    {[...items].reverse().map(item => <SearchHistoryCard key={item.id} item={item} onClick={() => onViewItem(item)} />)}
  </div>
);

const SearchHistoryCard: React.FC<{ item: SearchHistoryItem, onClick: () => void }> = ({ item, onClick }) => (
  <div onClick={onClick} className="bg-slate-700/50 p-4 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors border border-white/10">
    <div className="flex justify-between items-start">
        <div>
            <h4 className="font-bold text-white">{item.destination}</h4>
            <p className="text-xs text-gray-400 mt-1">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className="text-indigo-400 text-xs font-semibold bg-indigo-500/10 px-2 py-1 rounded-full">Click to view</span>
    </div>
    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 flex-wrap">
        <PreferenceChip icon="calendar" text={`${item.preferences.duration} days`} />
        <PreferenceChip icon="clock" text={item.preferences.pace} />
        <PreferenceChip icon="users" text={item.preferences.group} />
        <PreferenceChip icon="star" text={item.preferences.interests.split(',')[0]} />
    </div>
  </div>
);

const PreferenceChip: React.FC<{ icon: string, text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-1.5 text-xs text-gray-300">
        <Icon name={icon} className="w-4 h-4 text-gray-400" />
        <span>{text}</span>
    </div>
);

// Credit History Components
const CreditHistoryList: React.FC<{ items: CreditHistoryItem[] }> = ({ items }) => (
  <div className="space-y-2">
    {[...items].reverse().map(item => <CreditHistoryCard key={item.id} item={item} />)}
  </div>
);

const CreditHistoryCard: React.FC<{ item: CreditHistoryItem }> = ({ item }) => {
  const isCredit = item.amount > 0;
  return (
    <div className="flex items-center p-3 bg-slate-700/50 rounded-lg border border-white/10">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${isCredit ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        <Icon name={isCredit ? 'plus' : 'receipt'} className="w-5 h-5" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-white">{item.action}</p>
        <p className="text-xs text-gray-400">{item.date}</p>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
          {isCredit ? `+${item.amount}` : item.amount}
        </p>
        <p className="text-xs text-gray-400">Bal: {item.balance}</p>
      </div>
    </div>
  );
};

export default ProfileModal;
