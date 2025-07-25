"use client";

import React from 'react';
import { XIcon, StarIcon, TelegramIcon } from '../landing/icons';
import { ITEMS, Item } from '../creditstore/data/items';
import Modal from '../common/Modal';

interface UnifiedCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLandingPage?: boolean; // To differentiate styling and behavior
}

const UnifiedCreditsModal: React.FC<UnifiedCreditsModalProps> = ({ 
  isOpen, 
  onClose, 
  isLandingPage = false 
}) => {
  const handleViewFullStore = () => {
    onClose(); // Close modal first
    // Navigate to credit store page
    window.location.href = '/credit-store';
  };

  const getItemGradient = (index: number) => {
    const gradients = [
      'from-emerald-400 via-cyan-400 to-blue-500',
      'from-orange-400 via-pink-400 to-red-500',
      'from-purple-400 via-violet-400 to-indigo-500'
    ];
    return gradients[index % gradients.length];
  };

  const modalContent = (
    <div className={`${isLandingPage ? 'bg-white' : 'bg-gray-900'} rounded-lg shadow-xl w-full max-w-xs max-h-[75vh] overflow-hidden`}>
      {/* Header */}
      <div className={`${isLandingPage ? 'bg-gradient-to-r from-teal-600 to-blue-600' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} px-3 py-2 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="bg-white/20 p-1 rounded">
              <TelegramIcon className="w-3 h-3" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Credit Packages</h2>
              <p className={`${isLandingPage ? 'text-teal-100' : 'text-indigo-100'} text-xs leading-tight`}>
                Available packages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-0.5"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(75vh-80px)]">
        {ITEMS.map((item, index) => {
          const totalCredits = item.credits + (item.bonus || 0);
          
          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-md transition-all duration-300 border ${
                isLandingPage 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              {/* Popular badge for middle item */}
              {index === 1 && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="p-2 pt-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <div className={`w-6 h-6 bg-gradient-to-br ${getItemGradient(index)} rounded flex items-center justify-center shadow-sm`}>
                      <span className="text-xs">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-xs ${isLandingPage ? 'text-gray-900' : 'text-white'}`}>
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className={`text-xs ${isLandingPage ? 'text-gray-600' : 'text-gray-300'}`}>
                          {item.credits} credits
                        </span>
                        {item.bonus && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            +{item.bonus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center space-x-1 bg-yellow-100 px-1.5 py-0.5 rounded-full">
                      <StarIcon className="w-3 h-3 text-yellow-500" />
                      <span className="font-bold text-yellow-800 text-xs">{item.price}</span>
                    </div>
                  </div>
                </div>

                {/* Description - More compact */}
                <p className={`text-xs mb-1.5 ${isLandingPage ? 'text-gray-600' : 'text-gray-300'} leading-tight line-clamp-2`}>
                  {item.description}
                </p>

                {/* Total credits highlight */}
                <div className={`flex items-center justify-between p-1.5 rounded ${
                  isLandingPage ? 'bg-teal-50 border border-teal-200' : 'bg-indigo-900/30 border border-indigo-700'
                }`}>
                  <span className={`font-medium text-xs ${isLandingPage ? 'text-teal-800' : 'text-indigo-200'}`}>
                    Total:
                  </span>
                  <span className={`text-sm font-bold ${isLandingPage ? 'text-teal-600' : 'text-indigo-400'}`}>
                    {totalCredits}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation to credit store - Hide on landing page */}
        {!isLandingPage && (
          <div className="mt-3">
            <button 
              onClick={handleViewFullStore}
              className="w-full px-3 py-2 rounded-md font-bold transition-all duration-300 hover:shadow-lg active:scale-95 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <div className="flex items-center justify-center space-x-1.5">
                <TelegramIcon className="w-3 h-3" />
                <span className="text-xs">Go to Credit Store</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Footer note */}
        <div className={`text-xs text-center p-2 rounded ${
          isLandingPage ? 'text-gray-500 bg-gray-50' : 'text-gray-400 bg-gray-800'
        } ${!isLandingPage ? 'mt-2' : 'mt-3'}`}>
          <div className="inline-flex items-center space-x-1">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure payments via Telegram Stars</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLandingPage) {
    // For landing page, use simple overlay
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-[999] flex items-center justify-center p-4 animate-fade-in-fast" role="dialog" aria-modal="true">
        {modalContent}
      </div>
    );
  }

  // For main app, use the existing Modal component
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {modalContent}
    </Modal>
  );
};

export default UnifiedCreditsModal;
