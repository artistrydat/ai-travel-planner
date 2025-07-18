'use client';

interface RefundInstructionsModalProps {
  onClose: () => void;
  telegramChargeId: string;
  purchaseId: string;
}

export default function RefundInstructionsModal({ 
  onClose, 
  telegramChargeId, 
  purchaseId 
}: RefundInstructionsModalProps) {
  const botUrl = process.env.NEXT_PUBLIC_BOT_URL || "@MuhannedTrip_bot";
  
  const refundCommand = `/refund ${telegramChargeId}`;

  const handleOpenTelegram = () => {
    // Open Telegram bot
    window.open(`https://t.me/${botUrl.replace('@', '')}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3">
      <div className="bg-slate-800 border border-white/10 p-4 rounded-xl max-w-xs w-full shadow-2xl">
        <div className="text-center mb-3">
          <div className="text-2xl mb-1">↩️</div>
          <h3 className="text-lg font-bold text-white">Refund Instructions</h3>
        </div>
        
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-white/10">
          <p className="mb-2 text-sm text-gray-300">Use our Telegram bot:</p>
          
          <div className="mb-2 p-2 bg-slate-900 rounded border border-white/10">
            <code className="text-green-400 text-xs font-mono break-all">{refundCommand}</code>
          </div>
          
          <p className="text-xs text-gray-400 italic">
            Copy the command above and send it to our bot to process your refund.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleOpenTelegram}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            Open Bot
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
