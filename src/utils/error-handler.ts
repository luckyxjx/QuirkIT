import { ErrorCategory, ErrorMessageCollection } from '@/types';

export class ErrorHandler {
  private static errorMessages: ErrorMessageCollection = {
    chaotic: [
      "Oops! The chaos gremlins struck again! 🎭",
      "Well, that escalated quickly... Error code: MAYHEM",
      "The universe said 'nope' to your request!",
      "Error detected! Time to panic... or not. Your choice!",
      "Something went sideways in the digital realm!",
      "The code decided to take a coffee break!",
      "Houston, we have a problem... and it's not space-related!"
    ],
    chill: [
      "No worries, just a small hiccup. Take a deep breath.",
      "Everything's cool, just a minor technical timeout.",
      "Relax, we'll figure this out together.",
      "It's all good - just a temporary digital detour.",
      "Stay calm, this too shall pass.",
      "Just a gentle reminder that technology isn't perfect.",
      "Take it easy, we're working on it."
    ],
    meme: [
      "This is fine. Everything is fine. (It's not fine)",
      "Error 404: Motivation not found",
      "Task failed successfully!",
      "I'm not saying it was aliens... but it was aliens",
      "One does not simply... make error-free code",
      "Error: Success not found. Please try again.",
      "It's not a bug, it's a feature! (Just kidding, it's a bug)"
    ],
    sarcastic: [
      "Oh great, another error. How original.",
      "Congratulations! You found a bug. Here's your prize: frustration.",
      "Well, that worked exactly as expected... said no one ever.",
      "Error detected. Shocking, I know.",
      "Oh look, something broke. What a surprise.",
      "Another day, another error. Living the dream!",
      "Error found. The developers are probably very proud."
    ],
    gaming: [
      "Achievement Unlocked: Found a Bug!",
      "Game Over! Press F to pay respects.",
      "Error encountered! You need more XP to continue.",
      "Boss fight failed! The error monster wins this round.",
      "Connection to server lost. Respawning...",
      "Critical hit! The error deals 9999 damage.",
      "Quest failed: Debug the application"
    ],
    nerdy: [
      "Error 42: The answer to life, universe, and everything went wrong",
      "Segmentation fault (core dumped... your hopes and dreams)",
      "NullPointerException in real life detected",
      "Stack overflow in the space-time continuum",
      "Undefined behavior in the matrix",
      "Memory leak detected in human patience buffer",
      "Infinite loop found in error handling logic"
    ],
    fantasy: [
      "The ancient scrolls of code have been corrupted!",
      "A wild error appeared! It's super effective!",
      "The magic spell failed to compile properly.",
      "Your request was blocked by a firewall dragon.",
      "The server wizard is currently unavailable.",
      "Error curse has been cast upon your session!",
      "The digital realm rejects your offering."
    ],
    scifi: [
      "Error in the Matrix detected. Red pill or blue pill?",
      "Temporal paradox in the data stream!",
      "The AI has become self-aware... and buggy.",
      "Quantum entanglement error in the server farm.",
      "Houston, we have a 404 problem.",
      "Error detected in sector 7-G of the digital space.",
      "The mothership's communication array is down."
    ]
  };

  static getQuirkyMessage(error: Error, category?: ErrorCategory): string {
    const selectedCategory = category || this.getRandomCategory();
    const messages = this.errorMessages[selectedCategory];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    return `${randomMessage} (Error: ${error.message})`;
  }

  static logError(error: Error, context: string): void {
    console.error(`[${context}] Error:`, error);
    
    // In production, you might want to send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement error logging service integration
    }
  }

  static shouldUseFallback(error: Error): boolean {
    // Determine if we should use fallback data based on error type
    const fallbackErrors = [
      'ENOTFOUND',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ECONNRESET',
      'Network Error',
      'timeout'
    ];
    
    return fallbackErrors.some(errorType => 
      error.message.includes(errorType) || error.name.includes(errorType)
    );
  }

  private static getRandomCategory(): ErrorCategory {
    const categories = Object.values(ErrorCategory);
    return categories[Math.floor(Math.random() * categories.length)];
  }

  static createAPIError(message: string, code: string, category?: ErrorCategory) {
    return {
      success: false,
      error: {
        code,
        message: this.getQuirkyMessage(new Error(message), category),
        category: category || this.getRandomCategory()
      }
    };
  }
}