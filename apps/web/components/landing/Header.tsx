import React, { useState } from 'react';
import { VoyageAILogo, StarIcon } from '../shared/Logo';
import UnifiedCreditsModal from '../shared/UnifiedCreditsModal';

const Header: React.FC = () => {
  const [isCreditsModalOpen, setCreditsModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center shrink-0">
              <VoyageAILogo />
              <span className="ml-3 text-2xl font-extrabold text-[#0a4848]">VoyageAI</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button 
                onClick={() => setCreditsModalOpen(true)}
                className="hidden sm:flex items-center space-x-2 bg-yellow-100 text-yellow-800 font-bold px-4 py-2 rounded-full text-sm hover:bg-yellow-200 transition-all duration-200"
              >
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <span>credits pricing</span>
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