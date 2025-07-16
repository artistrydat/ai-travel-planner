
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  purchases: defineTable({
    userId: v.string(),
    itemId: v.string(),
    itemName: v.string(),
    price: v.number(),
    telegramChargeId: v.string(),
    isRefunded: v.boolean(),
  }).index('by_charge_id', ['telegramChargeId']),

  refunds: defineTable({
    userId: v.string(),
    telegramChargeId: v.string(),
    purchaseId: v.id('purchases'),
  }),
});
