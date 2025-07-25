import { mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';

// User mutations
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
      budget: v.optional(v.string()),
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
    budget: v.optional(v.string()),
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

// Purchase and refund mutations (for bot functionality)
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

// Export file mutations
export const createExportedFile = mutation({
  args: {
    storageId: v.string(),
    filename: v.string(),
    contentType: v.string(),
    userId: v.id('users'),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + (72 * 60 * 60 * 1000); // 72 hours expiration
    
    return await ctx.db.insert('exportedFiles', {
      ...args,
      createdAt: now,
      expiresAt,
    });
  },
});

export const deleteExportedFile = mutation({
  args: {
    fileId: v.id('exportedFiles'),
  },
  handler: async (ctx, { fileId }) => {
    await ctx.db.delete(fileId);
  },
});

// Feature request mutations
export const createFeatureRequest = mutation({
  args: {
    userId: v.id('users'),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    priority: v.string(),
    userEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const requestId = await ctx.db.insert('featureRequests', {
      ...args,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
    });
    
    return requestId;
  },
});

export const updateFeatureRequestStatus = mutation({
  args: {
    requestId: v.id('featureRequests'),
    status: v.string(),
  },
  handler: async (ctx, { requestId, status }) => {
    await ctx.db.patch(requestId, {
      status,
      updatedAt: Date.now(),
    });
  },
});
