export interface PlannerPreferences {
  destination: string;
  departureCity: string;
  duration: string;
  startDate: string;
  pace: 'Relaxed' | 'Moderate' | 'Packed';
  group: 'Solo' | 'Couple' | 'Family' | 'Friends';
  interests: string;
  budget: string;
}

export interface Activity {
  day: number;
  title: string;
  description: string;
  category: 'Food' | 'Entertainment' | 'Culture' | 'Outdoor' | 'Shopping' | 'Other';
  startTime: string; // "HH:mm"
  durationHours: number;
  localTip: string;
  latitude: number;
  longitude: number;
  placeId: string; // Google Maps Place ID
  imageUrl?: string; // Will be fetched client-side
  rating: number;
  ratingCount: number;
}

export interface DailyWeather {
  day: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Partly Cloudy';
  highTemp: number; // Celsius
  lowTemp: number; // Celsius
}

export interface FlightOption {
  airline: string;
  departureTime: string; // "HH:mm"
  arrivalTime: string; // "HH:mm"
  duration: string; // "Xh Ym"
  price: number; // In a major currency like USD
  bookingUrl: string;
}

export interface Itinerary {
  destination: string;
  itinerary: Activity[];
  weatherForecast: DailyWeather[];
  flightOptions: FlightOption[];
}

export interface UserProfile {
  name: string;
  handle: string;
  id: string;
}

export interface SearchHistoryItem {
  id: number; // using timestamp for unique id
  destination: string;
  date: string;
  preferences: PlannerPreferences;
  itinerary: Itinerary;
}

export interface CreditHistoryItem {
  id: number; // using timestamp for unique id
  date: string;
  action: string;
  amount: number;
  balance: number;
  purchaseId?: string; // For purchase items
  telegramChargeId?: string; // For purchase items
}

export interface Purchase {
  itemId: string;
  transactionId: string;
  timestamp: number;
}

export interface CurrentPurchaseWithSecret {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    credits: number;
    icon?: string;
  };
  transactionId: string;
  timestamp: number;
  secret: string;
}