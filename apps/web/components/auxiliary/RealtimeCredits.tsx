import React from 'react';
import { useUserByTelegramId } from '../../hooks/useConvexQueries';
import { useTelegramAuthStore } from '../../store/telegramAuthStore';

export function RealtimeCredits() {
  const { telegramUser } = useTelegramAuthStore();
  const { data: user, isLoading } = useUserByTelegramId(telegramUser?.id?.toString() || null);
  
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
