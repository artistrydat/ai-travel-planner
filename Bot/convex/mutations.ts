
import { internalMutation } from './_generated/server';
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
    await ctx.db.insert('purchases', {
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
