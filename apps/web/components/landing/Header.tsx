import React, { useState } from 'react';
import { VoyageAILogo, StarIcon } from '../shared/Logo';
import UnifiedCreditsModal from '../shared/UnifiedCreditsModal';

const Header: React.FC = () => {
  const [isCreditsModalOpen, setCreditsModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center shrink-0">
              <VoyageAILogo />
              <span className="ml-3 text-xl font-extrabold text-[#0a4848]">AI Trip Planner</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button 
                onClick={() => setCreditsModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 font-semibold px-3 py-2 rounded-full text-sm hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200 border border-yellow-200"
              >
                <StarIcon className="w-4 h-4 text-yellow-500" />
                <span>Credits</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <UnifiedCreditsModal 
        isOpen={isCreditsModalOpen} 
        onClose={() => setCreditsModalOpen(false)} 
        isLandingPage={true}
      />
    </>
  );
};

export default Header;