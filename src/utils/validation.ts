/**
 * Input validation utilities for API endpoints
 */
export class ValidationUtil {
  /**
   * Validate compliment text
   */
  static validateCompliment(text: string): { valid: boolean; error?: string } {
    if (!text || typeof text !== 'string') {
      return { valid: false, error: 'Compliment text is required' };
    }
    
    const trimmed = text.trim();
    
    if (trimmed.length === 0) {
      return { valid: false, error: 'Compliment cannot be empty' };
    }
    
    if (trimmed.length > 280) {
      return { valid: false, error: 'Compliment must be 280 characters or less' };
    }
    
    if (trimmed.length < 3) {
      return { valid: false, error: 'Compliment must be at least 3 characters long' };
    }
    
    // Basic profanity check (simple implementation)
    const profanityWords = ['spam', 'test123', 'badword']; // Placeholder list
    const lowerText = trimmed.toLowerCase();
    
    for (const word of profanityWords) {
      if (lowerText.includes(word)) {
        return { valid: false, error: 'Compliment contains inappropriate content' };
      }
    }
    
    return { valid: true };
  }

  /**
   * Validate spinner choices
   */
  static validateSpinnerChoices(choices: unknown): { valid: boolean; error?: string; choices?: string[] } {
    if (!Array.isArray(choices)) {
      return { valid: false, error: 'Choices must be an array' };
    }
    
    if (choices.length === 0) {
      return { valid: false, error: 'At least one choice is required' };
    }
    
    if (choices.length > 20) {
      return { valid: false, error: 'Maximum 20 choices allowed' };
    }
    
    const validChoices: string[] = [];
    
    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i];
      
      if (typeof choice !== 'string') {
        return { valid: false, error: `Choice ${i + 1} must be a string` };
      }
      
      const trimmed = choice.trim();
      
      if (trimmed.length === 0) {
        return { valid: false, error: `Choice ${i + 1} cannot be empty` };
      }
      
      if (trimmed.length > 100) {
        return { valid: false, error: `Choice ${i + 1} must be 100 characters or less` };
      }
      
      validChoices.push(trimmed);
    }
    
    // Check for duplicate choices
    const uniqueChoices = [...new Set(validChoices)];
    if (uniqueChoices.length !== validChoices.length) {
      return { valid: false, error: 'Duplicate choices are not allowed' };
    }
    
    return { valid: true, choices: validChoices };
  }

  /**
   * Validate timer type
   */
  static validateTimerType(type: unknown): { valid: boolean; error?: string; type?: 'short' | 'long' } {
    if (type === undefined || type === null) {
      return { valid: true }; // Optional parameter
    }
    
    if (typeof type !== 'string') {
      return { valid: false, error: 'Timer type must be a string' };
    }
    
    const validTypes = ['short', 'long'];
    if (!validTypes.includes(type)) {
      return { valid: false, error: 'Timer type must be either "short" or "long"' };
    }
    
    return { valid: true, type: type as 'short' | 'long' };
  }

  /**
   * Validate date string (YYYY-MM-DD format)
   */
  static validateDate(dateString: unknown): { valid: boolean; error?: string; date?: string } {
    if (dateString === undefined || dateString === null) {
      return { valid: true }; // Optional parameter
    }
    
    if (typeof dateString !== 'string') {
      return { valid: false, error: 'Date must be a string' };
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Invalid date' };
    }
    
    // Check if date is not too far in the past or future
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    
    if (date < oneYearAgo || date > oneYearFromNow) {
      return { valid: false, error: 'Date must be within one year of today' };
    }
    
    return { valid: true, date: dateString };
  }

  /**
   * Sanitize text input
   */
  static sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate JSON request body
   */
  static async validateJSONBody(request: Request): Promise<{ valid: boolean; error?: string; data?: unknown }> {
    try {
      const contentType = request.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        return { valid: false, error: 'Content-Type must be application/json' };
      }
      
      const data = await request.json();
      return { valid: true, data };
    } catch {
      return { valid: false, error: 'Invalid JSON in request body' };
    }
  }

  /**
   * Validate query parameters
   */
  static validateQueryParams(url: URL, requiredParams: string[] = [], optionalParams: string[] = []): { valid: boolean; error?: string; params?: Record<string, string> } {
    const params: Record<string, string> = {};
    const allParams = [...requiredParams, ...optionalParams];
    
    // Check required parameters
    for (const param of requiredParams) {
      const value = url.searchParams.get(param);
      if (!value) {
        return { valid: false, error: `Required parameter '${param}' is missing` };
      }
      params[param] = value;
    }
    
    // Get optional parameters
    for (const param of optionalParams) {
      const value = url.searchParams.get(param);
      if (value) {
        params[param] = value;
      }
    }
    
    // Check for unexpected parameters
    const providedParams = Array.from(url.searchParams.keys());
    const unexpectedParams = providedParams.filter(param => !allParams.includes(param));
    
    if (unexpectedParams.length > 0) {
      return { valid: false, error: `Unexpected parameters: ${unexpectedParams.join(', ')}` };
    }
    
    return { valid: true, params };
  }
}