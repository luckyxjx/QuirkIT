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
    const showerThoughtData = await ExternalAPIService.getShowerThought();
    return showerThoughtData;
  }, 'Shower Thought API');
}

export async function OPTIONS() {
  return APIResponseUtil.corsPreflightResponse();
}