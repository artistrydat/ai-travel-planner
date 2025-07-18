// Shared types for the AI Travel Planner project
export interface TelegramUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface PlannerPreferences {
  destination: string;
  departureCity: string;
  duration: string;
  startDate: string;
  pace: string;
  group: string;
  interests: string;
}

export interface Itinerary {
  destination: string;
  duration: string;
  totalBudget?: number;
  days: ItineraryDay[];
  recommendations?: {
    transportation?: string[];
    accommodation?: string[];
    activities?: string[];
  };
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  meals?: Meal[];
  accommodation?: string;
  dailyBudget?: number;
}

export interface Activity {
  time: string;
  activity: string;
  location: string;
  description?: string;
  cost?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant?: string;
  description?: string;
  cost?: number;
}

export interface SearchHistoryItem {
  _id: string;
  userId: string;
  destination: string;
  preferences: PlannerPreferences;
  itinerary: Itinerary;
  createdAt: number;
}

export interface CreditHistoryItem {
  _id: string;
  userId: string;
  action: string;
  amount: number;
  balanceAfter: number;
  createdAt: number;
  purchaseId?: string;
  telegramChargeId?: string;
}

export interface User {
  _id: string;
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  credits: number;
  createdAt: number;
  lastActiveAt: number;
}

export interface Purchase {
  _id: string;
  userId: string;
  itemId: string;
  itemName: string;
  price: number;
  telegramChargeId: string;
  isRefunded: boolean;
}

export interface Refund {
  _id: string;
  userId: string;
  telegramChargeId: string;
  purchaseId: string;
}

// Dashboard specific types
export interface DashboardStats {
  totalRevenue: number;
  purchaseCount: number;
  refundCount: number;
}

export interface SalesByDay {
  date: string;
  sales: number;
}

export interface Transaction {
  _id: string;
  type: 'purchase' | 'refund';
  userId: string;
  price?: number;
  itemName?: string;
  telegramChargeId: string;
  _creationTime: number;
}

// Zustand store types
export interface ItineraryState {
  currentItinerary: Itinerary | null;
  isGenerating: boolean;
  setCurrentItinerary: (itinerary: Itinerary | null) => void;
  setIsGenerating: (generating: boolean) => void;
}

export interface PreferencesState {
  preferences: PlannerPreferences;
  setPreferences: (preferences: Partial<PlannerPreferences>) => void;
  resetPreferences: () => void;
}

export interface UIState {
  activeModal: string | null;
  isMapLoaded: boolean;
  setActiveModal: (modal: string | null) => void;
  setIsMapLoaded: (loaded: boolean) => void;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  telegramUser: TelegramUser | null;
  setUser: (user: User | null) => void;
  setTelegramUser: (telegramUser: TelegramUser | null) => void;
  logout: () => void;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Telegram Web App types
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    hint_color: string;
    bg_color: string;
    text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  close: () => void;
  ready: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
