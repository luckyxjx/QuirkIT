import { NextResponse } from 'next/server';
import { APIResponse, ErrorCategory } from '@/types';
import { ErrorHandler } from './error-handler';

export class APIResponseUtil {
  /**
   * Create a successful API response
   */
  static success<T>(data: T, status: number = 200): NextResponse<APIResponse<T>> {
    return NextResponse.json({
      success: true,
      data
    }, { status });
  }

  /**
   * Create an error API response with quirky messaging
   */
  static error(
    message: string, 
    code: string = 'UNKNOWN_ERROR', 
    status: number = 500,
    category?: ErrorCategory
  ): NextResponse<APIResponse<never>> {
    const error = new Error(message);
    const quirkyMessage = ErrorHandler.getQuirkyMessage(error, category);
    
    ErrorHandler.logError(error, `API Error - ${code}`);
    
    return NextResponse.json({
      success: false,
      error: {
        code,
        message: quirkyMessage,
        category: category || ErrorCategory.CHAOTIC
      }
    }, { status });
  }

  /**
   * Create a rate limit error response
   */
  static rateLimitError(): NextResponse<APIResponse<never>> {
    return this.error(
      'Too many requests. Please slow down!',
      'RATE_LIMIT_EXCEEDED',
      429,
      ErrorCategory.CHILL
    );
  }

  /**
   * Create a validation error response
   */
  static validationError(message: string): NextResponse<APIResponse<never>> {
    return this.error(
      message,
      'VALIDATION_ERROR',
      400,
      ErrorCategory.SARCASTIC
    );
  }

  /**
   * Create a not found error response
   */
  static notFound(resource: string = 'Resource'): NextResponse<APIResponse<never>> {
    return this.error(
      `${resource} not found`,
      'NOT_FOUND',
      404,
      ErrorCategory.MEME
    );
  }

  /**
   * Create an external API error response
   */
  static externalAPIError(service: string): NextResponse<APIResponse<never>> {
    return this.error(
      `External service ${service} is currently unavailable`,
      'EXTERNAL_API_ERROR',
      503,
      ErrorCategory.NERDY
    );
  }

  /**
   * Create a timeout error response
   */
  static timeoutError(): NextResponse<APIResponse<never>> {
    return this.error(
      'Request timed out',
      'TIMEOUT_ERROR',
      408,
      ErrorCategory.GAMING
    );
  }

  /**
   * Handle async API operations with automatic error handling
   */
  static async handleAsync<T>(
    operation: () => Promise<T>,
    context: string = 'API Operation'
  ): Promise<NextResponse<APIResponse<T>>> {
    try {
      const result = await operation();
      return this.success(result);
    } catch (error) {
      const err = error as Error;
      ErrorHandler.logError(err, context);
      
      // Determine appropriate error response based on error type
      if (err.message.includes('timeout')) {
        return this.timeoutError();
      }
      
      if (err.message.includes('not found') || err.message.includes('404')) {
        return this.notFound();
      }
      
      if (err.message.includes('rate limit') || err.message.includes('429')) {
        return this.rateLimitError();
      }
      
      if (err.message.includes('validation') || err.message.includes('invalid')) {
        return this.validationError(err.message);
      }
      
      // Default to generic error
      return this.error(err.message, 'INTERNAL_ERROR', 500);
    }
  }

  /**
   * Validate request method
   */
  static validateMethod(request: Request, allowedMethods: string[]): boolean {
    return allowedMethods.includes(request.method);
  }

  /**
   * Create method not allowed response
   */
  static methodNotAllowed(allowedMethods: string[]): NextResponse<APIResponse<never>> {
    return NextResponse.json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
        category: ErrorCategory.SARCASTIC
      }
    }, { 
      status: 405,
      headers: {
        'Allow': allowedMethods.join(', ')
      }
    });
  }

  /**
   * Add CORS headers to response
   */
  static addCORSHeaders(response: NextResponse): NextResponse {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  /**
   * Create CORS preflight response
   */
  static corsPreflightResponse(): NextResponse {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
}