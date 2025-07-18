
import { internalMutation, mutation } from './_generated/server';
import { v } from 'convex/values';

export const createPurchase = internalMutation({
  args: {
    userId: v.string(),
    itemId: v.string(),
    itemName: v.string(),
    price: v.number(),
    telegramChargeId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('purchases', {
      ...args,
      isRefunded: false,
    });
  },
});

export const createRefund = internalMutation({
  args: {
    userId: v.string(),
    telegramChargeId: v.string(),
    purchaseId: v.id('purchases'),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('refunds', args);
  },
});

export const markAsRefunded = internalMutation({
  args: {
    purchaseId: v.id('purchases'),
  },
  handler: async (ctx, { purchaseId }) => {
    await ctx.db.patch(purchaseId, { isRefunded: true });
  },
});

// User-related mutations
export const createUser = mutation({
  args: {
    telegramId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await ctx.db.insert('users', {
      ...args,
      credits: 10, // Initial credits for new users (welcome bonus)
      createdAt: now,
      lastActiveAt: now,
    });
    
    // Add initial credit history entry
    await ctx.db.insert('creditHistory', {
      userId,
      action: 'Welcome bonus',
      amount: 10,
      balanceAfter: 10,
      createdAt: now,
    });
    
    return userId;
  },
});

export const updateUserCredits = mutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    action: v.string(),
    purchaseId: v.optional(v.id('purchases')),
    telegramChargeId: v.optional(v.string()),
  },
  handler: async (ctx, { userId, amount, action, purchaseId, telegramChargeId }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');
    
    const newCredits = Math.max(0, user.credits + amount);
    
    await ctx.db.patch(userId, { 
      credits: newCredits,
      lastActiveAt: Date.now(),
    });
    
    // Add credit history entry
    await ctx.db.insert('creditHistory', {
      userId,
      action,
      amount,
      balanceAfter: newCredits,
      createdAt: Date.now(),
      purchaseId,
      telegramChargeId,
    });
    
    return newCredits;
  },
});

export const addSearchHistory = mutation({
  args: {
    userId: v.id('users'),
    destination: v.string(),
    preferences: v.object({
      destination: v.string(),
      departureCity: v.string(),
      duration: v.string(),
      startDate: v.string(),
      pace: v.string(),
      group: v.string(),
      interests: v.string(),
    }),
    itinerary: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('searchHistory', {
      ...args,
      createdAt: Date.now(),
    });
    
    // Update user's last active time
    await ctx.db.patch(args.userId, {
      lastActiveAt: Date.now(),
    });
  },
});

export const setUserPreferences = mutation({
  args: {
    userId: v.id('users'),
    destination: v.string(),
    departureCity: v.string(),
    duration: v.string(),
    startDate: v.string(),
    pace: v.string(),
    group: v.string(),
    interests: v.string(),
  },
  handler: async (ctx, { userId, ...preferences }) => {
    // Check if preferences already exist for this user
    const existingPreferences = await ctx.db
      .query('preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();
    
    const now = Date.now();
    
    if (existingPreferences) {
      // Update existing preferences
      await ctx.db.patch(existingPreferences._id, {
        ...preferences,
        updatedAt: now,
      });
    } else {
      // Create new preferences
      await ctx.db.insert('preferences', {
        userId,
        ...preferences,
        updatedAt: now,
      });
    }
    
    // Update user's last active time
    await ctx.db.patch(userId, {
      lastActiveAt: now,
    });
  },
});
