import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { convex } from '../lib/convex';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

// User queries
export const useUserByTelegramId = (telegramId: string | null) => {
  return useQuery({
    queryKey: ['userByTelegramId', telegramId],
    queryFn: async () => {
      if (!telegramId) return null;
      return await convex.query(api.queries.getUserByTelegramId, { telegramId });
    },
    enabled: !!telegramId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 60 * 1000, // Refetch every minute (less frequent)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true,
  });
};

export const useSearchHistory = (userId: Id<"users"> | null) => {
  return useQuery({
    queryKey: ['searchHistory', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await convex.query(api.queries.getUserSearchHistory, { userId });
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreditHistory = (userId: Id<"users"> | null) => {
  return useQuery({
    queryKey: ['creditHistory', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await convex.query(api.queries.getUserCreditHistory, { userId });
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserPreferences = (userId: Id<"users"> | null) => {
  return useQuery({
    queryKey: ['userPreferences', userId],
    queryFn: async () => {
      if (!userId) return null;
      return await convex.query(api.queries.getUserPreferences, { userId });
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User mutations
export const useUpdateUserCredits = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, amount, action }: {
      userId: Id<"users">;
      amount: number;
      action: string;
    }) => {
      return await convex.mutation(api.mutations.updateUserCredits, {
        userId,
        amount,
        action,
      });
    },
    onSuccess: (_, { userId }) => {
      // Invalidate related queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['userByTelegramId'] });
      queryClient.invalidateQueries({ queryKey: ['creditHistory', userId] });
    },
  });
};

export const useAddSearchHistory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, searchData }: {
      userId: Id<"users">;
      searchData: any;
    }) => {
      return await convex.mutation(api.mutations.addSearchHistory, {
        userId,
        destination: searchData.destination,
        preferences: searchData.preferences,
        itinerary: searchData.itinerary,
      });
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory', userId] });
    },
  });
};

export const useSetUserPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, preferences }: {
      userId: Id<"users">;
      preferences: any;
    }) => {
      return await convex.mutation(api.mutations.setUserPreferences, {
        userId,
        destination: preferences.destination,
        departureCity: preferences.departureCity,
        duration: preferences.duration,
        startDate: preferences.startDate,
        pace: preferences.pace,
        group: preferences.group,
        interests: preferences.interests,
        budget: preferences.budget,
      });
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences', userId] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (telegramUser: any) => {
      return await convex.mutation(api.mutations.createUser, {
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
      });
    },
    onSuccess: (userId, telegramUser) => {
      // Invalidate user queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['userByTelegramId', telegramUser.id] });
    },
  });
};
