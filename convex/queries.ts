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
    
    // Group by destination and count frequency
    const destinationCounts = new Map<string, number>();
    
    for (const search of recentSearches) {
      const destination = search.destination;
      destinationCounts.set(destination, (destinationCounts.get(destination) || 0) + 1);
    }
    
    // Convert to array and sort by popularity
    const popularDestinations = Array.from(destinationCounts.entries())
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12); // Top 12 destinations
    
    return popularDestinations.map(item => ({
      destination: item.destination,
      createdAt: Date.now() // Using current time for consistency
    }));
  }
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
