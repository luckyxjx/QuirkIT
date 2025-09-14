import { 
  ExcuseResponse, 
  JokeResponse, 
  QuoteResponse, 
  ShowerThoughtResponse,
  HolidayResponse,
  DrinkResponse,
  TimerResponse
} from '@/types';

// Import fallback data
import fallbackExcuses from '@/data/fallback-excuses.json';
import fallbackJokes from '@/data/fallback-jokes.json';
import fallbackQuotes from '@/data/fallback-quotes.json';
import fallbackShowerThoughts from '@/data/fallback-showerthoughts.json';
import fallbackHolidays from '@/data/fallback-holidays.json';
import fallbackDrinks from '@/data/fallback-drinks.json';
import fallbackTimerBreaks from '@/data/fallback-timer-breaks.json';

export class DataLoader {
  // Excuse data
  static getRandomExcuse(): ExcuseResponse {
    const randomExcuse = fallbackExcuses[Math.floor(Math.random() * fallbackExcuses.length)];
    return {
      excuse: randomExcuse,
      source: 'fallback'
    };
  }

  static getAllExcuses(): string[] {
    return [...fallbackExcuses];
  }

  // Joke data
  static getRandomJoke(): JokeResponse {
    const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    return {
      joke: randomJoke.joke,
      type: randomJoke.type as 'dad' | 'oneliner',
      source: 'fallback'
    };
  }

  static getAllJokes(): Array<{joke: string; type: 'dad' | 'oneliner'}> {
    return [...fallbackJokes] as Array<{joke: string; type: 'dad' | 'oneliner'}>;
  }

  // Quote data
  static getRandomQuote(date?: string): QuoteResponse {
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    // Use UTC timezone for consistent daily rotation
    const targetDate = date || new Date().toISOString().split('T')[0];
    return {
      quote: randomQuote.quote,
      author: randomQuote.author,
      date: targetDate,
      source: 'fallback'
    };
  }

  static getAllQuotes(): Array<{quote: string; author: string}> {
    return [...fallbackQuotes];
  }

  // Shower thought data
  static getRandomShowerThought(): ShowerThoughtResponse {
    const randomThought = fallbackShowerThoughts[Math.floor(Math.random() * fallbackShowerThoughts.length)];
    return {
      thought: randomThought,
      source: 'fallback'
    };
  }

  static getAllShowerThoughts(): string[] {
    return [...fallbackShowerThoughts];
  }

  // Holiday data
  static getRandomHoliday(): HolidayResponse {
    const randomHoliday = fallbackHolidays[Math.floor(Math.random() * fallbackHolidays.length)];
    return {
      name: randomHoliday.name,
      description: randomHoliday.description,
      date: randomHoliday.date,
      source: 'fallback'
    };
  }

  static getTodaysHoliday(date?: string): HolidayResponse {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Try to find a holiday that matches today's date
    const todaysHoliday = fallbackHolidays.find(holiday => {
      const holidayDate = new Date(holiday.date);
      const targetDateObj = new Date(targetDate);
      
      // Match month and day (ignore year for recurring holidays)
      return holidayDate.getMonth() === targetDateObj.getMonth() && 
             holidayDate.getDate() === targetDateObj.getDate();
    });

    if (todaysHoliday) {
      return {
        name: todaysHoliday.name,
        description: todaysHoliday.description,
        date: targetDate, // Use the requested date
        source: 'fallback'
      };
    }

    // If no specific holiday for today, return quirky message
    return {
      name: "No Special Holiday Today",
      description: "welp unlucky , how about we do some work aye!!!",
      date: targetDate,
      source: 'fallback'
    };
  }

  static getAllHolidays(): Array<{name: string; description: string; date: string}> {
    return [...fallbackHolidays];
  }

  // Drink data
  static getRandomDrink(): DrinkResponse {
    const randomDrink = fallbackDrinks[Math.floor(Math.random() * fallbackDrinks.length)];
    return {
      name: randomDrink.name,
      ingredients: randomDrink.ingredients,
      instructions: randomDrink.instructions,
      source: 'fallback'
    };
  }

  static getAllDrinks(): Array<{name: string; ingredients: string[]; instructions: string[]}> {
    return [...fallbackDrinks];
  }

  // Timer break data
  static getRandomBreakSuggestion(type?: 'short' | 'long'): TimerResponse {
    let filteredBreaks = fallbackTimerBreaks;
    
    if (type) {
      filteredBreaks = fallbackTimerBreaks.filter(breakItem => breakItem.type === type);
    }
    
    const randomBreak = filteredBreaks[Math.floor(Math.random() * filteredBreaks.length)];
    return {
      breakSuggestion: randomBreak.suggestion,
      duration: randomBreak.duration,
      type: randomBreak.type as 'short' | 'long'
    };
  }

  static getAllBreakSuggestions(): Array<{suggestion: string; duration: number; type: 'short' | 'long'}> {
    return [...fallbackTimerBreaks] as Array<{suggestion: string; duration: number; type: 'short' | 'long'}>;
  }

  // Utility method to get fallback data for any feature
  static getFallbackData(feature: string): unknown[] {
    switch (feature) {
      case 'excuse':
        return this.getAllExcuses();
      case 'joke':
        return this.getAllJokes();
      case 'quote':
        return this.getAllQuotes();
      case 'showerthought':
        return this.getAllShowerThoughts();
      case 'holiday':
        return this.getAllHolidays();
      case 'drink':
        return this.getAllDrinks();
      case 'timer':
        return this.getAllBreakSuggestions();
      default:
        return [];
    }
  }
}