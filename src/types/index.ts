// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    category: ErrorCategory;
  };
}

// Feature Types
export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string; // CSS class for custom icon
  category: "mvp" | "expansion" | "advanced";
  enabled: boolean;
}

// API Response Data Types
export interface ExcuseResponse {
  excuse: string;
  source: "api" | "fallback";
}

export interface JokeResponse {
  joke: string;
  type: "dad" | "oneliner";
  source: "api" | "fallback";
}

export interface QuoteResponse {
  quote: string;
  author: string;
  date: string; // ISO date for daily rotation
  source?: "api" | "fallback";
}

export interface ShowerThoughtResponse {
  thought: string;
  source: "api" | "fallback";
}

export interface HolidayResponse {
  name: string;
  description: string;
  date: string;
  source: "api" | "fallback";
}

export interface DrinkResponse {
  name: string;
  ingredients: string[];
  instructions: string[];
  image?: string;
  source: "api" | "fallback";
}

export interface TimerResponse {
  breakSuggestion: string;
  duration: number;
  type: "short" | "long";
}

export interface SpinnerResponse {
  selectedChoice: string;
  choices: string[];
}

export interface ComplimentData {
  id: string;
  text: string;
  created_at: string;
  flag_count: number;
  status: "active" | "flagged" | "hidden";
}

// Error Types
export enum ErrorCategory {
  CHAOTIC = "chaotic",
  CHILL = "chill",
  MEME = "meme",
  SARCASTIC = "sarcastic",
  GAMING = "gaming",
  NERDY = "nerdy",
  FANTASY = "fantasy",
  SCIFI = "scifi",
}

// UI Component Types
export interface DashboardProps {
  features: FeatureCard[];
}

export interface ResponsiveGridProps {
  breakpoint: "mobile" | "tablet" | "desktop";
  columns: 1 | 2 | 3 | 4;
  touchOptimized: boolean;
}

export interface FeatureModalProps {
  feature: FeatureCard;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isMobile: boolean;
  orientation: "portrait" | "landscape";
}

export interface TouchInteractionProps {
  minTouchTarget: 44; // pixels
  swipeEnabled: boolean;
  touchFeedback: boolean;
}

// Cache Types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Error Message Collection
export interface ErrorMessageCollection {
  chaotic: string[];
  chill: string[];
  meme: string[];
  sarcastic: string[];
  gaming: string[];
  nerdy: string[];
  fantasy: string[];
  scifi: string[];
}

// Rate Limiting Types
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime?: number;
}

// API Health Types
export interface APIHealthStatus {
  healthy: boolean;
  lastCheck: number;
  responseTime?: number;
}

// External API Configuration
export interface ExternalAPIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  apiKey?: string;
}

// Fallback Data Types
export interface FallbackDataEntry<T> {
  data: T;
  lastUpdated: string;
  source: 'static' | 'cached';
}

// Request Context Types
export interface RequestContext {
  ip: string;
  userAgent: string;
  timestamp: number;
  endpoint: string;
}