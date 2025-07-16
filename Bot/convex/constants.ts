// Inspired by config.py from the original project.

export const ITEMS: Record<string, any> = {
  premium_plan: {
    name: '🌟 Premium Plan',
    price: 3, // Price in the smallest units of the currency (e.g. cents for USD)
    description: 'Access to premium AI trip planning features',
    secret: 'PREMIUM2025',
  },
  basic_plan: {
    name: '⭐ Basic Plan',
    price: 2,
    description: 'Essential trip planning features',
    secret: 'BASIC2025',
  },
  pro_guide: {
    name: '📖 Pro Travel Guide',
    price: 1,
    description: 'Comprehensive travel guide with insider tips',
    secret: 'PROGUIDE2025',
  },
};

export const MESSAGES = {
  welcome:
    '🤖 Welcome to AI Trip Planner Bot!\n\n' +
    'I can help you purchase premium features for your trip planning experience.\n\n' +
    'Choose what works best for you! 🚀',
  help:
    '🆘 AI Trip Planner Bot Help\n\n' +
    'Available commands:\n' +
    '/start - Show main menu\n' +
    '/help - Show this help message\n' +
    '/refund <transaction_id> - Request a refund for a purchase\n\n' +
    'For support, contact our team.',
  purchase_success: '🎉 Purchase successful! Your content has been unlocked.',
  purchase_failed: '❌ Purchase failed. Please try again.',
  refund_success: '✅ Refund processed successfully.',
  refund_failed: '❌ Refund failed. Please make sure the transaction ID is correct or contact support.',
  refund_usage:
    'Please provide the transaction ID after the /refund command.\n' +
    'Example: `/refund YOUR_TRANSACTION_ID`',
};
