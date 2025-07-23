import React from 'react';
import { XIcon, StarIcon, TelegramIcon } from './icons';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const creditPackages = [
    { stars: 100, credits: 100, popular: false },
    { stars: 500, credits: 550, popular: true },
    { stars: 1000, credits: 1200, popular: false },
  ];

  const handleBuy = (stars: number) => {
    alert(`Initiating purchase with ${stars} Telegram Stars.\n(This is a demo - no real payment will be processed)`);
    // In a real app, you would integrate with Telegram's WebApp API here.
    // e.g., window.Telegram.WebApp.openInvoice(...)
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[999] flex items-center justify-center p-4 animate-fade-in-fast" role="dialog" aria-modal="true" aria-labelledby="credits-modal-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
            <XIcon className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-full mb-3">
                <TelegramIcon className="w-8 h-8 text-blue-500" />
            </div>
            <h2 id="credits-modal-title" className="text-2xl font-bold text-[#0a4848]">Buy Credits with Telegram Stars</h2>
            <p className="mt-2 text-sm text-gray-500">
              Use Telegram Stars to purchase credits and unlock premium features. Payments are processed securely within Telegram.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {creditPackages.map((pkg, index) => (
              <div key={index} className={`border rounded-lg p-4 flex items-center justify-between transition-all ${pkg.popular ? 'border-yellow-400 bg-yellow-50/70 shadow-md scale-[1.02]' : 'border-gray-200'}`}>
                <div>
                  <div className="flex items-center text-lg font-bold text-[#0a4848]">
                    <StarIcon className="w-5 h-5 text-yellow-500 mr-2" />
                    <span>{pkg.credits.toLocaleString()} Credits</span>
                  </div>
                  {pkg.popular && <span className="ml-1 mt-1 text-xs font-bold text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full">POPULAR</span>}
                </div>
                <button 
                  onClick={() => handleBuy(pkg.stars)}
                  className="bg-[#0a4848] text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#0d5555] flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  {pkg.stars} <TelegramIcon className="w-4 h-4" /> Stars
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-xs text-gray-400 text-center">
            By completing your purchase, you agree to our Terms of Service.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsModal;
