import React from 'react';
import { useSearchHistory } from '../hooks/useConvexQueries';
import { useUserStore } from '../store/userStore';
import { Doc } from '../convex/_generated/dataModel';

type SearchHistoryItem = Doc<"searchHistory">;

export function RealtimeSearchHistory() {
  const { user } = useUserStore();
  const { data: searchHistory, isLoading, error } = useSearchHistory(user?._id || null);
  
  if (isLoading) {
    return <div className="text-gray-400">Loading search history...</div>;
  }
  
  if (error) {
    return <div className="text-red-400">Error loading search history</div>;
  }
  
  if (!searchHistory || searchHistory.length === 0) {
    return <div className="text-gray-400">No search history yet</div>;
  }
  
  return (
    <div className="space-y-1.5">
      <h3 className="text-white font-semibold text-sm">Recent Searches</h3>
      {searchHistory.slice(0, 5).map((item: SearchHistoryItem) => (
        <div key={item._id} className="bg-gray-800 p-2 rounded-lg">
          <div className="text-white font-medium text-sm">{item.destination}</div>
          <div className="text-gray-400 text-xs">
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
          <div className="text-gray-300 text-xs">
            {item.preferences.duration} days • {item.preferences.pace} pace
          </div>
        </div>
      ))}
    </div>
  );
}
