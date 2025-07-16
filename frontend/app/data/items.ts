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
    description: 'Comprehensive travel guide with insider tips',
    price: 1, // 1 Telegram Star
    credits: 10,
    icon: '📖'
  },
  {
    id: 'basic_plan',
    name: '⭐ Basic Plan',
    description: 'Essential trip planning features',
    price: 2, // 2 Telegram Stars
    credits: 25,
    icon: '⭐',
    bonus: 5
  },
  {
    id: 'premium_plan',
    name: '🌟 Premium Plan',
    description: 'Access to premium AI trip planning features',
    price: 3, // 3 Telegram Stars
    credits: 50,
    icon: '🌟',
    bonus: 15
  }
];

export function getItemById(itemId: string): Item | undefined {
  return ITEMS.find(item => item.id === itemId);
}

