import React from 'react';
import { useUserByTelegramId } from '../../hooks/useConvexQueries';
import { convexService } from '../../lib/convexService';

export function RealtimeCredits() {
  const telegramUser = convexService.getTelegramUser();
  const { data: user, isLoading } = useUserByTelegramId(telegramUser?.id || null);
  
  if (isLoading || !user) {
    return (
      <div className="text-yellow-400 font-bold text-sm">
        💰 -- credits
      </div>
    );
  }
  
  return (
    <div className="text-yellow-400 font-bold text-sm">
      💰 {user.credits} credits
    </div>
  );
}
