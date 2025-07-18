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

  const getItemGradient = (index: number) => {
    const gradients = [
      'from-emerald-400 via-cyan-400 to-blue-500',
      'from-orange-400 via-pink-400 to-red-500',
      'from-purple-400 via-violet-400 to-indigo-500'
    ];
    return gradients[index % gradients.length];
  };

  const getCardGradient = (index: number) => {
    const gradients = [
      'from-emerald-500/5 via-cyan-500/5 to-blue-500/10',
      'from-orange-500/5 via-pink-500/5 to-red-500/10',
      'from-purple-500/5 via-violet-500/5 to-indigo-500/10'
    ];
    return gradients[index % gradients.length];
  };

  const getBorderGradient = (index: number) => {
    const gradients = [
      'from-emerald-400/30 to-blue-400/30',
      'from-orange-400/30 to-red-400/30',
      'from-purple-400/30 to-indigo-400/30'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-1.5 px-1">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`relative overflow-hidden rounded-lg transition-all duration-300 active:scale-[0.98] cursor-pointer group hover:shadow-md`}
          onClick={() => handleItemClick(item)}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          }}
        >
          {/* Animated gradient border */}
          <div className={`absolute inset-0 bg-gradient-to-r ${getBorderGradient(index)} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="absolute inset-[1px] bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-lg" />
          
          {/* Content container */}
          <div className="relative p-2.5">
            {/* Header section - all in one line */}
            <div className="flex items-center gap-2 mb-1.5">
              {/* Icon with enhanced styling */}
              <div className={`relative w-8 h-8 bg-gradient-to-br ${getItemGradient(index)} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm" />
                <span className="text-base relative z-10 drop-shadow-sm">{item.icon}</span>
              </div>
              
              {/* Title and price section */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm leading-tight group-hover:text-blue-100 transition-colors duration-200 truncate">
                  {item.name}
                </h3>
              </div>
              
              {/* Price badge */}
              <div className="flex items-center gap-0.5 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 px-1.5 py-0.5 rounded-full border border-amber-400/40 shadow-sm">
                <span className="text-amber-400 text-xs">⭐</span>
                <span className="text-sm font-bold text-amber-100">{item.price}</span>
              </div>
            </div>
            
            {/* Description - smaller and single line */}
            <p className="text-gray-300 mb-1.5 text-xs leading-tight group-hover:text-gray-200 transition-colors duration-200 line-clamp-1">
              {item.description}
            </p>
            
            {/* Credits section - compact horizontal layout */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1">
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r ${getCardGradient(index)} border border-white/20 shadow-sm backdrop-blur-sm`}>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-blue-100">
                    {item.credits}
                  </span>
                </div>
                {item.bonus && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 shadow-sm backdrop-blur-sm">
                    <span className="text-amber-400 text-xs">+{item.bonus}</span>
                  </div>
                )}
              </div>
              
              {/* Total credits display */}
              <div className="text-right">
                <span className="text-xs text-gray-400">Total: </span>
                <span className="text-xs font-bold text-white">
                  {item.credits + (item.bonus || 0)}
                </span>
              </div>
            </div>
            
            {/* Purchase button - more compact */}
            <button className={`w-full bg-gradient-to-r ${getItemGradient(index)} text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 hover:shadow-md active:scale-95 shadow-sm border border-white/10 relative overflow-hidden group/btn`}>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center justify-center gap-1">
                <span>Buy with Stars</span>
                <span className="text-xs">⭐</span>
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
