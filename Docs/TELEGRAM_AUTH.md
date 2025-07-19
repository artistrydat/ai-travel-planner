# Telegram Authentication Implementation

This document explains the improved Telegram authentication system implemented in the AI Travel Planner.

## Overview

The new authentication system provides:
- Automatic Telegram WebApp detection
- Secure server-side verification 
- Seamless routing between Telegram and non-Telegram users
- Zustand state management
- TanStack Query for API calls

## Architecture

### Components

1. **useTelegram Hook** (`hooks/useTelegram.ts`)
   - Detects Telegram WebApp context
   - Provides helper functions for Telegram features
   - Handles WebApp initialization

2. **Telegram Auth Store** (`store/telegramAuthStore.ts`)
   - Manages authentication state with Zustand
   - Persists user data securely (non-sensitive only)
   - Provides helper methods

3. **TelegramGuard Component** (`components/auxiliary/TelegramGuard.tsx`)
   - Route protection based on Telegram auth
   - Automatic redirects for different user types
   - Loading states and error handling

4. **API Route** (`app/api/auth/telegram/route.ts`)
   - Server-side verification of Telegram initData
   - Cryptographic validation using bot token
   - Security checks (timestamp, hash validation)

### Usage Patterns

#### Protecting Routes
```tsx
// For Telegram-only routes
<TelegramGuard requireAuth={true}>
  <YourComponent />
</TelegramGuard>

// For public routes (allows both)
<TelegramGuard requireAuth={false}>
  <YourComponent />
</TelegramGuard>
```

#### Using Telegram Features
```tsx
const MyComponent = () => {
  const { isTelegram, showMainButton, getTelegramUser } = useTelegram();
  const { isAuthenticated } = useTelegramAuthStore();
  
  if (isTelegram && isAuthenticated()) {
    // Telegram-specific features
    showMainButton('Save', () => {
      // Handle save action
    });
  }
  
  return <div>...</div>;
};
```

#### Authentication Verification
```tsx
const MyComponent = () => {
  const { telegramUser, setTelegramData } = useTelegramAuthStore();
  const { getTelegramUser, getInitData } = useTelegram();
  
  const handleLogin = () => {
    const user = getTelegramUser();
    const initData = getInitData();
    
    if (user && initData) {
      setTelegramData(initData, user);
    }
  };
  
  return (
    <button onClick={handleLogin}>
      {telegramUser ? 'Logged In' : 'Login with Telegram'}
    </button>
  );
};
```

## Setup Instructions

### 1. Environment Variables
```bash
# Required: Get from @BotFather
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Optional: Auth timeout (default: 24 hours)
TELEGRAM_AUTH_TIMEOUT=86400
```

### 2. Bot Configuration
1. Message @BotFather on Telegram
2. Create or edit your bot
3. Set the Web App URL to your domain
4. Copy the bot token to your environment variables

### 3. Domain Setup
- Configure your domain in @BotFather
- Ensure HTTPS is enabled for production
- Test the Web App URL from Telegram

## Security Features

### Server-Side Verification
- All Telegram initData is verified cryptographically
- Hash validation using HMAC-SHA256
- Timestamp checks to prevent replay attacks
- Bot token validation

### Client-Side Security
- Session storage (not localStorage) for auth data
- No sensitive data persisted long-term
- Automatic auth clearing on context loss

### Best Practices
- Always verify on server before trusting client
- Use HTTPS in production
- Rotate bot tokens periodically
- Monitor for unusual auth patterns

## Routing Strategy

### User Flow
```
Non-Telegram User:
/any-route → /landing → stays on public pages

Telegram User (unauthenticated):
/any-route → auth verification → /main-app or error

Telegram User (authenticated):
/landing → / (main app)
/any-route → stays on protected routes
```

### Route Protection
- `/landing`, `/privacy`, `/credits` - Public pages
- `/` (main app) - Telegram-only, requires auth
- `/app/*` - Reserved for future Telegram-specific routes

## Testing

### Local Development
1. Use ngrok or similar to expose localhost
2. Update bot Web App URL to your tunnel URL
3. Test from Telegram app on mobile device

### Production Testing
1. Deploy to your domain
2. Update bot Web App URL
3. Test all user flows
4. Monitor logs for auth failures

## Troubleshooting

### Common Issues

**"Authentication Failed"**
- Check bot token in environment variables
- Verify domain matches bot configuration
- Ensure HTTPS is working

**"Telegram WebApp not detected"**
- Confirm Telegram script is loaded
- Check browser console for errors
- Test on actual Telegram app (not web browser)

**Infinite redirects**
- Check route protection logic
- Verify fallback paths are correct
- Monitor network requests in dev tools

### Debug Mode
Enable debug logging by checking browser console:
- Telegram detection logs
- Auth verification responses
- Redirect logic decisions

## Migration from Old System

The old `TelegramAuthGuard` has been replaced with the new `TelegramGuard`. 

Key changes:
- More robust Telegram detection
- Server-side verification
- Better error handling
- Cleaner state management

Update your components:
```tsx
// Old
<TelegramAuthGuard>
  <YourComponent />
</TelegramAuthGuard>

// New
<TelegramGuard requireAuth={true}>
  <YourComponent />
</TelegramGuard>
```
