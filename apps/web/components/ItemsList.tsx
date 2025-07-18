import React from 'react';
import { Item } from '@/app/data/items';

interface ItemsListProps {
  items: Item[];
  onPurchase: (item: Item) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({ items, onPurchase }) => {
  const handleItemClick = (item: Item) => {
    // Add haptic feedback if available
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    onPurchase(item);
  };

  return (
    <div className="space-y-3 px-1">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border border-white/15 rounded-2xl p-4 transition-all duration-200 active:scale-[0.98] cursor-pointer hover:from-slate-700/90 hover:to-slate-600/90 shadow-xl backdrop-blur-sm hover:shadow-2xl hover:border-white/25"
          onClick={() => handleItemClick(item)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <span className="text-2xl relative z-10">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="font-bold text-white text-lg leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-400/30 shadow-sm">
                    {item.credits} credits
                  </span>
                  {item.bonus && (
                    <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/30 shadow-sm">
                      +{item.bonus} bonus ✨
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 px-3 py-1.5 rounded-full border border-amber-400/30">
                <span className="text-amber-400 text-sm">⭐</span>
                <span className="text-lg font-bold text-white">{item.price}</span>
              </div>
              <button className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:from-indigo-600 hover:to-pink-600 shadow-lg active:scale-95 hover:shadow-xl border border-white/10 min-w-[100px]">
                Buy Now with Telegram Stars ⭐
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
