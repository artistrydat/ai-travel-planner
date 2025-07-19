import { PlannerPreferences, Itinerary } from '../types/types';
import { convex } from './convex';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

// Interface for Telegram user data
export interface TelegramUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

// Interface for Convex user data
export interface ConvexUser {
  _id: Id<"users">;
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  credits: number;
  createdAt: number;
  lastActiveAt: number;
}

// Interface for search history from Convex
export interface ConvexSearchHistory {
  _id: Id<"searchHistory">;
  _creationTime: number;
  userId: Id<"users">;
  destination: string;
  preferences: {
    destination: string;
    departureCity: string;
    duration: string;
    startDate: string;
    pace: string;
    group: string;
    interests: string;
  };
  itinerary: any;
  createdAt: number;
}

// Interface for credit history from Convex
export interface ConvexCreditHistory {
  _id: Id<"creditHistory">;
  userId: Id<"users">;
  action: string;
  amount: number;
  balanceAfter: number;
  createdAt: number;
}

class ConvexService {
  constructor() {
    console.log('ConvexService initialized');
    console.log('Environment NEXT_PUBLIC_CONVEX_URL:', process.env.NEXT_PUBLIC_CONVEX_URL);
  }

  // Replace HTTP methods with Convex mutations/queries
  async getUserByTelegramId(telegramId: string): Promise<ConvexUser | null> {
    try {
      return await convex.query(api.queries.getUserByTelegramId, {
        telegramId
      });
    } catch (error) {
      console.error('Error getting user by telegram ID:', error);
      throw error;
    }
  }

  async getOrCreateUser(telegramUser: TelegramUser): Promise<ConvexUser> {
    try {
      // First check if user exists
      console.log('Checking if user exists for telegramId:', telegramUser.id);
      const existingUser = await this.getUserByTelegramId(telegramUser.id);
      
      if (existingUser) {
        console.log('User exists:', existingUser);
        return existingUser;
      }
      
      // Create new user if doesn't exist
      console.log('Creating new user for telegramId:', telegramUser.id);
      const userId = await convex.mutation(api.mutations.createUser, {
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
      });
      
      console.log('User created with ID:', userId);
      
      // Fetch the created user
      const newUser = await this.getUserByTelegramId(telegramUser.id);
      
      if (!newUser) {
        throw new Error('Failed to create user');
      }
      
      console.log('New user created successfully:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error in getOrCreateUser:', error);
      throw error;
    }
  }

  // Get user data (search history, credit history, preferences)
  async getUserData(userId: Id<"users">) {
    try {
      const [searchHistory, creditHistory, preferences] = await Promise.all([
        convex.query(api.queries.getUserSearchHistory, { userId }),
        convex.query(api.queries.getUserCreditHistory, { userId }),
        convex.query(api.queries.getUserPreferences, { userId }),
      ]);
      
      return {
        searchHistory: searchHistory || [],
        creditHistory: creditHistory || [],
        preferences: preferences,
      };
    } catch (error) {
      console.error('ConvexService: Error fetching user data for userId:', userId, error);
      // Return empty data structure instead of throwing to prevent app crashes
      return {
        searchHistory: [],
        creditHistory: [],
        preferences: null,
      };
    }
  }

  // Get fresh user profile with current credits
  async getUserProfile(telegramId: string): Promise<ConvexUser> {
    try {
      console.log('ConvexService: Getting user profile for telegramId:', telegramId);
      const user = await convex.query(api.queries.getUserByTelegramId, { telegramId });
      console.log('ConvexService: User profile response:', user);
      if (!user) {
        throw new Error('No user data returned from server');
      }
      return user;
    } catch (error) {
      console.error('ConvexService: Error fetching user profile for telegramId:', telegramId, error);
      throw error;
    }
  }

  // Update user credits
  async updateCredits(userId: Id<"users">, amount: number, action: string): Promise<number> {
    return await convex.mutation(api.mutations.updateUserCredits, {
      userId,
      amount,
      action,
    });
  }

  // Add search history
  async addSearchHistory(
    userId: Id<"users">,
    destination: string,
    preferences: PlannerPreferences,
    itinerary: Itinerary
  ): Promise<void> {
    await convex.mutation(api.mutations.addSearchHistory, {
      userId,
      destination,
      preferences,
      itinerary,
    });
  }

  // Set user preferences
  async setPreferences(userId: Id<"users">, preferences: PlannerPreferences): Promise<void> {
    await convex.mutation(api.mutations.setUserPreferences, {
      userId,
      destination: preferences.destination,
      departureCity: preferences.departureCity,
      duration: preferences.duration,
      startDate: preferences.startDate,
      pace: preferences.pace,
      group: preferences.group,
      interests: preferences.interests,
      budget: preferences.budget,
    });
  }

  // Get Telegram WebApp user data
  getTelegramUser(): TelegramUser | null {
    try {
      if (typeof window === 'undefined') {
        console.log('getTelegramUser: Running on server side');
        return null;
      }
      
      console.log('getTelegramUser: Checking for Telegram WebApp...');
      
      // Check if we're in Telegram WebApp
      const telegram = (window as any).Telegram;
      if (telegram?.WebApp) {
        const webApp = telegram.WebApp;
        console.log('getTelegramUser: Telegram WebApp found, calling ready()');
        webApp.ready();
        
        // Configure the WebApp for better user experience
        webApp.expand(); // Expand to full height
        webApp.disableVerticalSwipes(); // Prevent accidental closing
        
        console.log('getTelegramUser: WebApp initDataUnsafe:', webApp.initDataUnsafe);
        
        if (webApp.initDataUnsafe?.user) {
          const user = {
            id: webApp.initDataUnsafe.user.id.toString(),
            first_name: webApp.initDataUnsafe.user.first_name,
            last_name: webApp.initDataUnsafe.user.last_name,
            username: webApp.initDataUnsafe.user.username,
          };
          console.log('getTelegramUser: Found Telegram user:', user);
          return user;
        } else {
          console.log('getTelegramUser: No user data in initDataUnsafe');
        }
      } else {
        console.log('getTelegramUser: Telegram WebApp not found');
      }
      
      console.log('getTelegramUser: No user data available');
      return null;
    } catch (error) {
      console.error('getTelegramUser: Error getting Telegram user:', error);
      return null;
    }
  }

  // Refresh Telegram WebApp interface
  refreshTelegramApp(): void {
    try {
      if (typeof window !== 'undefined') {
        const telegram = (window as any).Telegram;
        if (telegram?.WebApp) {
          console.log('Triggering Telegram WebApp refresh...');
          // Expand the app first to ensure proper display
          telegram.WebApp.expand();
          // Send a haptic feedback to indicate success
          if (telegram.WebApp.HapticFeedback) {
            telegram.WebApp.HapticFeedback.notificationOccurred('success');
          }
          // Show main button temporarily to indicate completion
          telegram.WebApp.MainButton.setText('Welcome! 🎉');
          telegram.WebApp.MainButton.show();
          setTimeout(() => {
            telegram.WebApp.MainButton.hide();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error refreshing Telegram app:', error);
    }
  }
}

export const convexService = new ConvexService();
