import { PlannerPreferences, Itinerary } from '../types';
import { convex } from './convex';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

// Use environment variable for Convex URL, fallback to the provided URL
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://descriptive-starfish-159.convex.site';

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
  private baseUrl: string;

  constructor() {
    this.baseUrl = CONVEX_URL;
    console.log('ConvexService initialized with URL:', this.baseUrl);
    console.log('Environment NEXT_PUBLIC_CONVEX_URL:', process.env.NEXT_PUBLIC_CONVEX_URL);
  }

  // Test connection to Convex
  async testConnection(): Promise<boolean> {
    try {
      const testUrl = `${this.baseUrl}/test`;
      console.log('Testing connection to:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
      });
      
      console.log('Test connection response status:', response.status);
      console.log('Test connection response ok:', response.ok);
      
      if (response.ok) {
        const text = await response.text();
        console.log('Test connection response text:', text);
      }
      
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  private async makeRequest(endpoint: string, data?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('Making request to:', url);
    console.log('Request data:', data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || `HTTP error! status: ${response.status}` };
      }
      
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response data:', result);
    return result;
  }

  // Replace HTTP methods with Convex mutations/queries
  async getOrCreateUser(telegramUser: TelegramUser): Promise<ConvexUser> {
    // First check if user exists
    const existingUser = await convex.query(api.queries.getUserByTelegramId, {
      telegramId: telegramUser.id
    });
    
    if (existingUser) {
      return existingUser;
    }
    
    // Create new user if doesn't exist
    const userId = await convex.mutation(api.mutations.createUser, {
      telegramId: telegramUser.id,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
    });
    
    // Fetch the created user
    const newUser = await convex.query(api.queries.getUserByTelegramId, {
      telegramId: telegramUser.id
    });
    
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    
    return newUser;
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
      
      // Fallback for development/testing - you can remove this in production
      if (process.env.NODE_ENV === 'development') {
        console.log('getTelegramUser: Using development fallback user');
        return {
          id: '976417275',
          first_name: 'Muhanned',
          last_name: 'Almusfer',
          username: 'malmusfer',
        };
      }
      
      console.log('getTelegramUser: No user data available');
      return null;
    } catch (error) {
      console.error('getTelegramUser: Error getting Telegram user:', error);
      return null;
    }
  }
}

export const convexService = new ConvexService();
