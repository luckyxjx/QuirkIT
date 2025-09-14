import { NextRequest } from 'next/server';
import { ExternalAPIService } from '@/utils/external-api';
import { APIResponseUtil } from '@/utils/api-response';

export async function GET(request: NextRequest) {
  // Validate method
  if (!APIResponseUtil.validateMethod(request, ['GET'])) {
    return APIResponseUtil.methodNotAllowed(['GET']);
  }

  // Handle the request with automatic error handling
  return APIResponseUtil.handleAsync(async () => {
    // Get break type from query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'short' | 'long' | undefined;
    
    const timerData = await ExternalAPIService.getTimerBreak(type);
    return timerData;
  }, 'Timer API');
}

export async function OPTIONS() {
  return APIResponseUtil.corsPreflightResponse();
}