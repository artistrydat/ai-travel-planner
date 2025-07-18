export interface Item {
  id: string;
  name: string;
  description: string;
  price: number; // Price in Telegram Stars
  credits: number;
  icon?: string;
  bonus?: number; // Bonus credits for special packages
}

export const ITEMS: Item[] = [
  {
    id: 'pro_guide',
    name: '📖 Pro Travel Guide',
    description: 'Unlock comprehensive travel guides with insider tips, local recommendations, and detailed destination insights for your perfect trip.',
    price: 1, // 1 Telegram Star
    credits: 10, // Base credits
    bonus: 0, // No bonus
    icon: '📖'
  },
  {
    id: 'basic_plan',
    name: '⭐ Basic Plan',
    description: 'Essential trip planning features including AI-powered itineraries, restaurant recommendations, and activity suggestions for your journey.',
    price: 2, // 2 Telegram Stars
    credits: 25, // Base credits
    bonus: 5, // Bonus credits = 30 total
    icon: '⭐'
  },
  {
    id: 'premium_plan',
    name: '🌟 Premium Plan',
    description: 'Access premium AI trip planning with advanced customization, real-time updates, weather integration, and personalized travel assistance.',
    price: 3, // 3 Telegram Stars
    credits: 50, // Base credits
    bonus: 15, // Bonus credits = 65 total
    icon: '🌟'
  }
];

export function getItemById(itemId: string): Item | undefined {
  return ITEMS.find(item => item.id === itemId);
}

