/**
 Core Data Models & Type Definitions for Travel Saathi
 */

export type BudgetLevel = 'budget' | 'moderate' | 'luxury';

export interface DestinationSummary {
  id: string;
  name: string;
  country: string;
  tagline: string;
  rating: number;
  imageUrl: string;
  vibe: string;
  estimatedBudgetPerDay: number;
  popularAttractions: string[];
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: string[];
  suggestedFood: string[];
}

export interface GeneratedItinerary {
  destination: string;
  durationDays: number;
  budgetLevel: BudgetLevel;
  summary: string;
  schedule: ItineraryDay[];
}

export interface DiaryEntry {
  id: string;
  title: string;
  location: string;
  date: string;
  notes: string;
  expenseAmount: number;
  photos: string[];
  createdAt: string;
}

export interface RewardItem {
  id: number | string;
  title: string;
  cost: number;
  icon: string;
  description: string;
  unlocked?: boolean;
}

export interface BookingOption {
  id: string;
  title: string;
  category: 'hotels' | 'flights' | 'trains' | 'buses';
  price: number;
  rating: number;
  locationOrRoute: string;
  imageUrl?: string;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  travelPoints: number;
  totalTripsLogged: number;
}
