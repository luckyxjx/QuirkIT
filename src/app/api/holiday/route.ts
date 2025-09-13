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
    // Get date parameter from URL if provided
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || undefined;
    
    const holidayData = await ExternalAPIService.getHoliday(date);
    return holidayData;
  }, 'Holiday API');
}

export async function OPTIONS() {
  return APIResponseUtil.corsPreflightResponse();
}