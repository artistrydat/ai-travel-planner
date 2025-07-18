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
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="bg-slate-700/50 border border-white/10 rounded-xl p-4 transition-all duration-150 active:scale-[0.97] cursor-pointer hover:bg-slate-700 shadow-lg"
          onClick={() => handleItemClick(item)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <span className="text-xl">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base truncate">
                  {item.name}
                </h3>
                <p className="text-sm mt-1 text-gray-300 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center mt-3 space-x-2 flex-wrap">
                  <span className="text-xs px-3 py-1 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {item.credits} credits
                  </span>
                  {item.bonus && (
                    <span className="text-xs px-3 py-1 rounded-full font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      +{item.bonus} bonus ✨
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <div className="text-lg font-bold mb-2 flex items-center justify-end text-white">
                <span className="mr-1 text-amber-400">⭐</span>
                <span>{item.price}</span>
              </div>
              <button className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 hover:from-indigo-600 hover:to-pink-600 shadow-md active:scale-95">
                Buy with Stars
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
