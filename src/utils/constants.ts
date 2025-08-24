import { FeatureCard } from '@/types';

export const FEATURES: FeatureCard[] = [
  // Phase 1 (MVP) Features
  {
    id: 'excuse-generator',
    title: 'Excuse Generator',
    description: 'Generate random funny excuses for any situation',
    icon: 'feature-icon-excuse',
    category: 'mvp',
    enabled: false
  },
  {
    id: 'joke-viewer',
    title: 'Joke Viewer',
    description: 'Enjoy random dad jokes and one-liners',
    icon: 'feature-icon-joke',
    category: 'mvp',
    enabled: false
  },
  {
    id: 'quote-of-day',
    title: 'Quote of the Day',
    description: 'Daily motivational and entertaining quotes',
    icon: 'feature-icon-quote',
    category: 'mvp',
    enabled: false
  },
  
  // Phase 2 (Expansion) Features
  {
    id: 'shower-thoughts',
    title: 'Shower Thoughts',
    description: 'Random deep and funny thoughts to ponder',
    icon: 'feature-icon-thought',
    category: 'expansion',
    enabled: false
  },
  {
    id: 'holiday-finder',
    title: 'Holiday Finder',
    description: 'Discover obscure holidays happening today',
    icon: 'feature-icon-holiday',
    category: 'expansion',
    enabled: false
  },
  {
    id: 'drink-recipes',
    title: 'Drink Recipes',
    description: 'Random cocktail and mocktail recipes',
    icon: 'feature-icon-drink',
    category: 'expansion',
    enabled: false
  },
  
  // Phase 3 (Advanced) Features
  {
    id: 'productivity-timer',
    title: 'Productivity Timer',
    description: 'Pomodoro timer with weird break suggestions',
    icon: 'feature-icon-timer',
    category: 'advanced',
    enabled: false
  },
  {
    id: 'decision-spinner',
    title: 'Decision Spinner',
    description: 'Spin the wheel to make random choices',
    icon: 'feature-icon-spinner',
    category: 'advanced',
    enabled: false
  },
  {
    id: 'compliment-machine',
    title: 'Compliment Machine',
    description: 'Send and receive anonymous compliments',
    icon: 'feature-icon-compliment',
    category: 'advanced',
    enabled: false
  }
];

export const API_ENDPOINTS = {
  EXCUSE: '/api/excuse',
  JOKE: '/api/joke',
  QUOTE: '/api/quote',
  SHOWER_THOUGHT: '/api/showerthought',
  HOLIDAY: '/api/holiday',
  DRINK: '/api/drink',
  TIMER: '/api/timer',
  SPINNER: '/api/spinner',
  COMPLIMENT: '/api/compliment'
};

export const EXTERNAL_APIS = {
  COCKTAIL_DB: 'https://www.thecocktaildb.com/api/json/v1/1',
  JOKE_API: 'https://v2.jokeapi.dev/joke',
  QUOTABLE: 'https://api.quotable.io',
  CALENDARIFIC: 'https://calendarific.com/api/v2'
};

export const CACHE_KEYS = {
  DAILY_QUOTE: (date: string) => `cache:quote:daily:${date}`,
  API_CACHE: (service: string, hash: string) => `cache:api:${service}:${hash}`,
  FALLBACK_REFRESH: (feature: string) => `cache:fallback:${feature}`
};

// Time constants
export const TIME_CONSTANTS = {
  CACHE_TTL: 300, // 5 minutes
  DAILY_CACHE_TTL: 86400, // 24 hours
  API_TIMEOUT: 5000, // 5 seconds
  RATE_LIMIT_WINDOW: 60, // 1 minute
  RATE_LIMIT_MAX: 100, // requests per window
  HEALTH_CHECK_INTERVAL: 300, // 5 minutes
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRIES: 3
} as const;

// External API configurations
export const API_CONFIGS = {
  JOKE_API: {
    baseUrl: 'https://v2.jokeapi.dev',
    timeout: 5000,
    retries: 2,
    params: {
      blacklistFlags: 'nsfw,religious,political,racist,sexist,explicit',
      type: 'single'
    }
  },
  QUOTABLE: {
    baseUrl: 'https://api.quotable.io',
    timeout: 5000,
    retries: 2
  },
  COCKTAIL_DB: {
    baseUrl: 'https://www.thecocktaildb.com/api/json/v1/1',
    timeout: 5000,
    retries: 2
  },
  CALENDARIFIC: {
    baseUrl: 'https://calendarific.com/api/v2',
    timeout: 5000,
    retries: 2,
    requiresApiKey: true
  }
} as const;

// Validation constants
export const VALIDATION_LIMITS = {
  COMPLIMENT_MIN_LENGTH: 3,
  COMPLIMENT_MAX_LENGTH: 280,
  SPINNER_MAX_CHOICES: 20,
  SPINNER_CHOICE_MAX_LENGTH: 100,
  MAX_TEXT_INPUT_LENGTH: 1000
} as const;

// Error categories for themed error messages
export const ERROR_CATEGORIES = {
  CHAOTIC: 'chaotic',
  CHILL: 'chill',
  MEME: 'meme',
  SARCASTIC: 'sarcastic',
  GAMING: 'gaming',
  NERDY: 'nerdy',
  FANTASY: 'fantasy',
  SCIFI: 'scifi'
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// Feature data sources
export const DATA_SOURCES = {
  API: 'api',
  FALLBACK: 'fallback',
  CACHE: 'cache'
} as const;

// Feature categories
export const FEATURE_CATEGORIES = {
  MVP: 'mvp',
  EXPANSION: 'expansion',
  ADVANCED: 'advanced'
} as const;