import { kvUtils } from '@/lib/kv';
import { ErrorHandler } from './error-handler';
import { DataLoader } from './data-loader';
import { 
  ExcuseResponse, 
  JokeResponse, 
  QuoteResponse, 
  ShowerThoughtResponse,
  HolidayResponse,
  DrinkResponse,
  TimerResponse,
  SpinnerResponse
} from '@/types';

export class ExternalAPIService {
  private static readonly CACHE_TTL = 300; // 5 minutes
  private static readonly REQUEST_TIMEOUT = 5000; // 5 seconds

  static async fetchWithFallback<T>(
    apiCall: () => Promise<T>,
    fallbackData: T[],
    cacheKey: string
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await kvUtils.getCache<T>(cacheKey);
      if (cached) {
        return cached;
      }

      // Try external API
      const result = await Promise.race([
        apiCall(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), this.REQUEST_TIMEOUT)
        )
      ]);

      // Cache the result
      await kvUtils.setCache(cacheKey, result, this.CACHE_TTL);
      return result;

    } catch (error) {
      ErrorHandler.logError(error as Error, 'ExternalAPIService');
      
      if (ErrorHandler.shouldUseFallback(error as Error)) {
        // Return random fallback data
        const randomIndex = Math.floor(Math.random() * fallbackData.length);
        return fallbackData[randomIndex];
      }
      
      throw error;
    }
  }

  static async fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Health check for external APIs
  static async checkAPIHealth(apiUrl: string): Promise<boolean> {
    try {
      const response = await fetch(apiUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Specific API methods with fallback integration
  static async getExcuse(): Promise<ExcuseResponse> {
    const cacheKey = 'api:excuse:random';
    
    try {
      return await this.fetchWithFallback(
        async () => {
          // Try Bored API for creative activities that can be used as excuses
          // Since there's no dedicated excuse API, we'll use our fallback data primarily
          // but keep the structure for future API integration
          throw new Error('No external excuse API available - using fallback');
        },
        [DataLoader.getRandomExcuse()],
        cacheKey
      );
    } catch (error) {
      ErrorHandler.logError(error as Error, 'getExcuse');
      return DataLoader.getRandomExcuse();
    }
  }

  static async getJoke(): Promise<JokeResponse> {
    const cacheKey = 'api:joke:random';
    
    try {
      return await this.fetchWithFallback(
        async () => {
          // Try JokeAPI
          const response = await this.fetchJSON<{
            joke?: string;
            setup?: string;
            delivery?: string;
            type: string;
          }>('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single');
          
          return {
            joke: response.joke || `${response.setup} ${response.delivery}`,
            type: 'dad' as const,
            source: 'api' as const
          };
        },
        [DataLoader.getRandomJoke()],
        cacheKey
      );
    } catch (error) {
      ErrorHandler.logError(error as Error, 'getJoke');
      return DataLoader.getRandomJoke();
    }
  }

  static async getQuote(date?: string): Promise<QuoteResponse> {
    // Use UTC timezone for consistent daily rotation
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = `api:quote:daily:${targetDate}`;
    
    try {
      // Check daily cache first
      const cached = await kvUtils.getDailyQuote(targetDate);
      if (cached) {
        return cached as unknown as QuoteResponse;
      }

      const quote = await this.fetchWithFallback(
        async () => {
          // Try Quotable.io API
          const response = await this.fetchJSON<{
            content: string;
            author: string;
          }>('https://api.quotable.io/random');
          
          return {
            quote: response.content,
            author: response.author,
            date: targetDate,
            source: 'api' as const
          };
        },
        [DataLoader.getRandomQuote(targetDate)],
        cacheKey
      );

      // Cache daily quote
      await kvUtils.setDailyQuote(targetDate, quote as unknown as Record<string, unknown>);
      return quote;
    } catch (error) {
      ErrorHandler.logError(error as Error, 'getQuote');
      return DataLoader.getRandomQuote(targetDate);
    }
  }

  static async getShowerThought(): Promise<ShowerThoughtResponse> {
    const cacheKey = 'api:showerthought:random';
    
    try {
      return await this.fetchWithFallback(
        async () => {
          // Try Reddit API or similar (placeholder)
          const response = await this.fetchJSON<{thought: string}>('https://api.example.com/showerthought');
          return {
            thought: response.thought,
            source: 'api' as const
          };
        },
        [DataLoader.getRandomShowerThought()],
        cacheKey
      );
    } catch (error) {
      ErrorHandler.logError(error as Error, 'getShowerThought');
      return DataLoader.getRandomShowerThought();
    }
  }

  static async getHoliday(date?: string): Promise<HolidayResponse> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = `api:holiday:${targetDate}`;
    
    try {
      return await this.fetchWithFallback(
        async () => {
          // Try Calendarific API (would need API key)
          const response = await this.fetchJSON<{
            response: {
              holidays: Array<{
                name: string;
                description: string;
                date: { iso: string };
              }>;
            };
          }>(`https://calendarific.com/api/v2/holidays?api_key=${process.env.CALENDARIFIC_API_KEY}&country=US&year=${new Date().getFullYear()}&day=${new Date().getDate()}&month=${new Date().getMonth() + 1}`);
          
          const holiday = response.response.holidays[0];
          return {
            name: holiday.name,
            description: holiday.description,
            date: holiday.date.iso,
            source: 'api' as const
          };
        },
        [DataLoader.getTodaysHoliday()],
        cacheKey
      );
    } catch (error) {
      ErrorHandler.logError(error as Error, 'getHoliday');
      return DataLoader.getTodaysHoliday();
    }
  }

  static async getDrink(): Promise<DrinkResponse> {
    const cacheKey = 'api:drink:random';
    
    try {
      return await this.fetchWithFallback(
        async () => {
          // Try TheCocktailDB API
          const response = await this.fetchJSON<{
            drinks: Array<{
              strDrink: string;
              strInstructions: string;
              strDrinkThumb?: string;
              [key: string]: string | undefined;
            }>;
          }>('https://www.thecocktaildb.com/api/json/v1/1/random.php');
          
          const drink = response.drinks[0];
          const ingredients: string[] = [];
          
          // Extract ingredients (strIngredient1, strIngredient2, etc.)
          for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient) {
              ingredients.push(measure ? `${measure} ${ingredient}` : ingredient);
            }
          }
          
          return {
            name: drink.strDrink,
            ingredients,
            instructions: drink.strInstructions.split('. ').filter(step => step.trim()),
            image: drink.strDrinkThumb,
            source: 'api' as const
          };
        },
        [DataLoader.getRandomDrink()],
        cacheKey
      );
    } catch (error) {
      ErrorHandler.logError(error as Error, 'getDrink');
      return DataLoader.getRandomDrink();
    }
  }

  static async getTimerBreak(type?: 'short' | 'long'): Promise<TimerResponse> {
    const cacheKey = `api:timer:break:${type || 'any'}`;
    
    try {
      return await this.fetchWithFallback(
        async () => {
          // For timer breaks, we primarily use local data
          // but could integrate with productivity APIs in the future
          return DataLoader.getRandomBreakSuggestion(type);
        },
        [DataLoader.getRandomBreakSuggestion(type)],
        cacheKey
      );
    } catch (error) {
      ErrorHandler.logError(error as Error, 'getTimerBreak');
      return DataLoader.getRandomBreakSuggestion(type);
    }
  }

  static async getSpinnerResult(choices: string[]): Promise<SpinnerResponse> {
    if (!choices || choices.length === 0) {
      throw new Error('No choices provided for spinner');
    }
    
    const selectedChoice = choices[Math.floor(Math.random() * choices.length)];
    
    return {
      selectedChoice,
      choices: [...choices]
    };
  }
}