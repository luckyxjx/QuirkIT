import { NextRequest } from 'next/server';
import { APIResponseUtil } from '@/utils/api-response';

interface SpinnerRequest {
  choices: string[];
}

interface SpinnerResponse {
  selectedChoice: string;
  selectedIndex: number;
  spinDuration: number;
  rotations: number;
}

export async function POST(request: NextRequest) {
  // Validate method
  if (!APIResponseUtil.validateMethod(request, ['POST'])) {
    return APIResponseUtil.methodNotAllowed(['POST']);
  }

  // Handle the request with automatic error handling
  return APIResponseUtil.handleAsync(async () => {
    const body: SpinnerRequest = await request.json();
    
    // Validate input
    if (!body.choices || !Array.isArray(body.choices) || body.choices.length === 0) {
      throw new Error('Choices array is required and must not be empty');
    }

    if (body.choices.length > 5) {
      throw new Error('Maximum 5 choices allowed');
    }

    // Validate each choice
    const validChoices = body.choices.filter(choice => 
      typeof choice === 'string' && choice.trim().length > 0
    );

    if (validChoices.length === 0) {
      throw new Error('At least one valid choice is required');
    }

    // Generate random selection
    const selectedIndex = Math.floor(Math.random() * validChoices.length);
    const selectedChoice = validChoices[selectedIndex];

    // Generate spin animation parameters - fast and snappy
    const spinDuration = Math.random() * 800 + 1200; // 1.2-2 seconds
    const rotations = Math.random() * 2 + 3; // 3-5 full rotations

    const response: SpinnerResponse = {
      selectedChoice,
      selectedIndex,
      spinDuration,
      rotations
    };

    return response;
  }, 'Decision Spinner API');
}

export async function OPTIONS() {
  return APIResponseUtil.corsPreflightResponse();
}