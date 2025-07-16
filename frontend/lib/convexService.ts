import { PlannerPreferences, Itinerary } from '../types';

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
  _id: string;
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
  _id: string;
  userId: string;
  destination: string;
  preferences: PlannerPreferences;
  itinerary: Itinerary;
  createdAt: number;
}

// Interface for credit history from Convex
export interface ConvexCreditHistory {
  _id: string;
  userId: string;
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

  // Get or create user by Telegram data
  async getOrCreateUser(telegramUser: TelegramUser): Promise<ConvexUser> {
    const response = await this.makeRequest('/user', {
      telegramId: telegramUser.id,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
    });
    return response.user;
  }

  // Get user data (search history, credit history, preferences)
  async getUserData(userId: string) {
    try {
      const response = await this.makeRequest('/user-data', { userId });
      return {
        searchHistory: response.searchHistory || [],
        creditHistory: response.creditHistory || [],
        preferences: response.preferences,
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
      const response = await this.makeRequest('/user', { telegramId });
      console.log('ConvexService: User profile response:', response);
      if (!response.user) {
        throw new Error('No user data returned from server');
      }
      return response.user;
    } catch (error) {
      console.error('ConvexService: Error fetching user profile for telegramId:', telegramId, error);
      throw error;
    }
  }

  // Update user credits
  async updateCredits(userId: string, amount: number, action: string): Promise<number> {
    const response = await this.makeRequest('/update-credits', {
      userId,
      amount,
      action,
    });
    return response.credits;
  }

  // Add search history
  async addSearchHistory(
    userId: string,
    destination: string,
    preferences: PlannerPreferences,
    itinerary: Itinerary
  ): Promise<void> {
    await this.makeRequest('/add-search-history', {
      userId,
      destination,
      preferences,
      itinerary,
    });
  }

  // Set user preferences
  async setPreferences(userId: string, preferences: PlannerPreferences): Promise<void> {
    await this.makeRequest('/set-preferences', {
      userId,
      ...preferences,
    });
  }

  // Get Telegram WebApp user data
  getTelegramUser(): TelegramUser | null {
    if (typeof window === 'undefined') return null;
    
    // Check if we're in Telegram WebApp
    const telegram = (window as any).Telegram;
    if (telegram?.WebApp) {
      const webApp = telegram.WebApp;
      webApp.ready();
      
      if (webApp.initDataUnsafe?.user) {
        return {
          id: webApp.initDataUnsafe.user.id.toString(),
          first_name: webApp.initDataUnsafe.user.first_name,
          last_name: webApp.initDataUnsafe.user.last_name,
          username: webApp.initDataUnsafe.user.username,
        };
      }
    }
    
    // Fallback for development/testing - you can remove this in production
    if (process.env.NODE_ENV === 'development') {
      return {
        id: '976417275',
        first_name: 'Muhanned',
        last_name: 'Almusfer',
        username: 'malmusfer',
      };
    }
    
    return null;
  }
}

export const convexService = new ConvexService();
