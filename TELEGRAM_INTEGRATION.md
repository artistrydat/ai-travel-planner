# AI Travel Planner - Telegram Integration

This project now includes full Telegram WebApp integration with Convex backend for user management and data persistence.

## New Features

### Backend (Convex)
- **User Management**: Automatic user creation and authentication via Telegram
- **Data Persistence**: All user data is stored in Convex database
- **Credit System**: Track and manage user credits with full transaction history
- **Search History**: Store and retrieve all user's travel plans
- **Preferences**: Save user preferences for future use

### Frontend Integration
- **Telegram WebApp**: Seamless integration with Telegram's WebApp API
- **Real-time Data**: All data synced with Convex backend
- **User Profile**: Dynamic profile modal with real Telegram user data
- **Error Handling**: Comprehensive error states and loading indicators

## Database Schema

### Users Table
```typescript
{
  telegramId: string,        // Telegram user ID
  firstName?: string,        // User's first name
  lastName?: string,         // User's last name  
  username?: string,         // Telegram username
  credits: number,           // Available credits
  createdAt: number,         // Account creation timestamp
  lastActiveAt: number,      // Last activity timestamp
}
```

### Search History Table
```typescript
{
  userId: Id<"users">,       // Reference to user
  destination: string,       // Travel destination
  preferences: object,       // Full preferences object
  itinerary: any,           // Complete itinerary data
  createdAt: number,        // Search timestamp
}
```

### Credit History Table
```typescript
{
  userId: Id<"users">,       // Reference to user
  action: string,           // Description of action
  amount: number,           // Credit change (+ or -)
  balanceAfter: number,     // Balance after transaction
  createdAt: number,        // Transaction timestamp
}
```

### Preferences Table
```typescript
{
  userId: Id<"users">,       // Reference to user
  destination: string,       // Last destination
  departureCity: string,     // Last departure city
  duration: string,          // Trip duration
  startDate: string,         // Start date
  pace: string,             // Travel pace
  group: string,            // Group type
  interests: string,        // User interests
  updatedAt: number,        // Last update timestamp
}
```

## API Endpoints

### `/user` (POST)
Get or create user by Telegram ID
```typescript
Request: {
  telegramId: string,
  firstName?: string,
  lastName?: string,
  username?: string
}
Response: { user: ConvexUser }
```

### `/user-data` (POST)
Get user's search history, credit history, and preferences
```typescript
Request: { userId: string }
Response: {
  searchHistory: ConvexSearchHistory[],
  creditHistory: ConvexCreditHistory[],
  preferences?: ConvexPreferences
}
```

### `/update-credits` (POST)
Update user's credit balance
```typescript
Request: {
  userId: string,
  amount: number,
  action: string
}
Response: { credits: number }
```

### `/add-search-history` (POST)
Add new search to user's history
```typescript
Request: {
  userId: string,
  destination: string,
  preferences: PlannerPreferences,
  itinerary: Itinerary
}
Response: { success: boolean }
```

### `/set-preferences` (POST)
Save user's preferences
```typescript
Request: {
  userId: string,
  destination: string,
  departureCity: string,
  duration: string,
  startDate: string,
  pace: string,
  group: string,
  interests: string
}
Response: { success: boolean }
```

## Usage Flow

### 1. User Initialization
When the app loads, it automatically:
- Detects Telegram WebApp environment
- Extracts user data from Telegram
- Creates/fetches user from Convex database
- Loads user's saved data

### 2. Creating Itineraries
When users create travel plans:
- Credits are deducted via Convex API
- Search history is saved to database
- Preferences are updated
- Credit transaction is recorded

### 3. Profile Management
The profile modal displays:
- Real Telegram user information
- Live credit balance from database
- Search history from Convex
- Credit transaction history

## Development Setup

1. **Convex Backend**: The schema and API endpoints are already set up
2. **Environment Variables**: Ensure CONVEX_URL is correct in the service file
3. **Telegram Testing**: For development, fallback user data is provided
4. **Production**: Works seamlessly with Telegram WebApp

## Key Files Modified

- `Bot/convex/schema.ts` - Database schema
- `Bot/convex/queries.ts` - Database queries
- `Bot/convex/mutations.ts` - Database mutations
- `Bot/convex/http.ts` - HTTP API endpoints
- `frontend/lib/convexService.ts` - Frontend API service
- `frontend/store/userStore.ts` - User state management
- `frontend/store/preferencesStore.ts` - Preferences with Convex sync
- `frontend/app/page.tsx` - Main app with user initialization
- `frontend/components/ProfileModal.tsx` - Real user data display

## Error Handling

The app includes comprehensive error handling for:
- User initialization failures
- Network connectivity issues
- Database operation errors
- Telegram WebApp integration issues

Users will see appropriate error messages and retry options when issues occur.
