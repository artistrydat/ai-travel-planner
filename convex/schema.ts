import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // User management
  users: defineTable({
    telegramId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    credits: v.number(),
    createdAt: v.number(),
    lastActiveAt: v.number(),
  }).index('by_telegram_id', ['telegramId']),

  // Travel planning data
  searchHistory: defineTable({
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
    itinerary: v.any(), // Store the complete itinerary object
    createdAt: v.number(),
  }).index('by_user', ['userId']),

  preferences: defineTable({
    userId: v.id('users'),
    destination: v.string(),
    departureCity: v.string(),
    duration: v.string(),
    startDate: v.string(),
    pace: v.string(),
    group: v.string(),
    interests: v.string(),
    budget: v.optional(v.string()),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  // Credit and purchase management
  creditHistory: defineTable({
    userId: v.id('users'),
    action: v.string(),
    amount: v.number(),
    balanceAfter: v.number(),
    createdAt: v.number(),
    purchaseId: v.optional(v.id('purchases')), // Link to purchase for refunds
    telegramChargeId: v.optional(v.string()), // Store charge ID for easy refunds
  }).index('by_user', ['userId']),

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

  // File storage management
  exportedFiles: defineTable({
    storageId: v.string(),
    filename: v.string(),
    contentType: v.string(),
    userId: v.id('users'),
    size: v.number(),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()), // Optional expiration timestamp
  }).index('by_user', ['userId'])
    .index('by_storage_id', ['storageId']),

  // Feature requests
  featureRequests: defineTable({
    userId: v.id('users'),
    title: v.string(),
    description: v.string(),
    category: v.string(), // e.g., "UI/UX", "New Feature", "Bug Fix", "Integration"
    priority: v.string(), // e.g., "Low", "Medium", "High", "Critical"
    userEmail: v.optional(v.string()),
    status: v.string(), // e.g., "Submitted", "Under Review", "In Progress", "Completed", "Rejected"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user', ['userId'])
    .index('by_status', ['status'])
    .index('by_category', ['category']),
});
