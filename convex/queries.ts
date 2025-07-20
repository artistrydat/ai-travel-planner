import { query, internalQuery } from './_generated/server';
import { v } from 'convex/values';

// User queries
export const getUserByTelegramId = query({
  args: { telegramId: v.string() },
  handler: async (ctx, { telegramId }) => {
    return await ctx.db
      .query('users')
      .withIndex('by_telegram_id', (q) => q.eq('telegramId', telegramId))
      .unique();
  },
});

export const getUserSearchHistory = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('searchHistory')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

export const getUserCreditHistory = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('creditHistory')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

export const getUserPreferences = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();
  },
});

// Dashboard queries (for bot analytics)
export const getDashboardStats = query({
  handler: async (ctx) => {
    const purchases = await ctx.db.query('purchases').collect();
    const refunds = await ctx.db.query('refunds').collect();

    const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0);
    const purchaseCount = purchases.length;
    const refundCount = refunds.length;

    return {
      totalRevenue,
      purchaseCount,
      refundCount,
    };
  },
});

export const getRecentTransactions = query({
  handler: async (ctx) => {
    const purchases = await ctx.db.query('purchases').order('desc').take(10);
    const refunds = await ctx.db.query('refunds').order('desc').take(10);

    const all = [
      ...purchases.map(p => ({ ...p, type: 'purchase' as const })),
      ...refunds.map(r => ({ ...r, type: 'refund' as const }))
    ];

    all.sort((a, b) => b._creationTime - a._creationTime);

    return all.slice(0, 15);
  }
});

export const getSalesByDay = query({
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    const purchases = await ctx.db
      .query('purchases')
      .filter(q => q.gte(q.field('_creationTime'), thirtyDaysAgo))
      .collect();
        
    const salesByDay = new Map<string, number>();

    for (const purchase of purchases) {
      const date = new Date(purchase._creationTime).toISOString().split('T')[0];
      salesByDay.set(date, (salesByDay.get(date) || 0) + purchase.price);
    }

    const sortedSales = Array.from(salesByDay.entries())
      .map(([date, sales]) => ({ date, sales }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedSales;
  }
});

// Public queries for landing page
export const getRecentPopularSearches = query({
  handler: async (ctx) => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    const recentSearches = await ctx.db
      .query('searchHistory')
      .filter(q => q.gte(q.field('_creationTime'), sevenDaysAgo))
      .collect();
    
    // Group by destination and count frequency, include full itinerary data and ID
    const destinationMap = new Map<string, { destination: string, count: number, itinerary: any, _id: string, _creationTime: number }>();
    
    for (const search of recentSearches) {
      const destination = search.destination;
      const existing = destinationMap.get(destination);
      if (existing) {
        existing.count += 1;
        // Keep the most recent one
        if (search._creationTime > existing._creationTime) {
          existing._id = search._id;
          existing._creationTime = search._creationTime;
          existing.itinerary = search.itinerary;
        }
      } else {
        destinationMap.set(destination, {
          destination: search.destination,
          count: 1,
          itinerary: search.itinerary, // Include the full itinerary data
          _id: search._id, // Include the ID for direct linking
          _creationTime: search._creationTime
        });
      }
    }
    
    // Convert to array and sort by popularity
    const popularDestinations = Array.from(destinationMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 12); // Top 12 destinations
    
    return popularDestinations.map(item => ({
      destination: item.destination,
      createdAt: item._creationTime,
      itinerary: item.itinerary, // Include itinerary data for preview
      _id: item._id // Include ID for direct linking to trip page
    }));
  }
});

export const getSearchHistoryById = query({
  args: { searchHistoryId: v.id('searchHistory') },
  handler: async (ctx, { searchHistoryId }) => {
    return await ctx.db.get(searchHistoryId);
  },
});

export const getDestinationItineraries = query({
  args: { destinationSlug: v.string() },
  handler: async (ctx, args) => {
    // Convert slug back to potential destination names
    const searchTerms = args.destinationSlug
      .split('-')
      .map(term => term.charAt(0).toUpperCase() + term.slice(1))
      .join(' ');
    
    // Find itineraries that contain the search terms in the destination
    const itineraries = await ctx.db
      .query("searchHistory")
      .collect();
    
    // Filter based on destination containing key terms
    const filtered = itineraries.filter(itinerary => {
      const dest = itinerary.destination.toLowerCase();
      return searchTerms.toLowerCase().split(' ').some(term => 
        dest.includes(term.toLowerCase()) || 
        (args.destinationSlug === 'bali' && dest.includes('bali')) ||
        (args.destinationSlug === 'dubai' && dest.includes('dubai'))
      );
    });
    
    return filtered.slice(0, 12); // Limit to 12 itineraries
  },
});

// Internal queries (for server-side operations)
export const getPurchaseByChargeId = internalQuery({
  args: { telegramChargeId: v.string() },
  handler: async (ctx, { telegramChargeId }) => {
    return await ctx.db
      .query('purchases')
      .withIndex('by_charge_id', (q) => q.eq('telegramChargeId', telegramChargeId))
      .unique();
  },
});

// File storage queries
export const getExportedFileByStorageId = query({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    return await ctx.db
      .query('exportedFiles')
      .withIndex('by_storage_id', (q) => q.eq('storageId', storageId))
      .unique();
  },
});

export const getUserExportedFiles = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const now = Date.now();
    return await ctx.db
      .query('exportedFiles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.or(
        q.eq(q.field('expiresAt'), undefined),
        q.gt(q.field('expiresAt'), now)
      ))
      .order('desc')
      .collect();
  },
});

export const getExpiredFiles = query({
  args: { currentTime: v.number() },
  handler: async (ctx, { currentTime }) => {
    return await ctx.db
      .query('exportedFiles')
      .filter((q) => q.and(
        q.neq(q.field('expiresAt'), undefined),
        q.lt(q.field('expiresAt'), currentTime)
      ))
      .collect();
  },
});
