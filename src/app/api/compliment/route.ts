/* eslint-disable react/no-unescaped-entities */

import { NextRequest } from 'next/server';
import { APIResponseUtil } from '@/utils/api-response';
import { Redis } from '@upstash/redis';

interface ComplimentData {
    id: string;
    message: string;
    sender: string;
    timestamp: number;
    isModerated: boolean;
    isApproved: boolean;
    moderationFlags?: string[];
}

// In-memory storage for when Redis is not available
let inMemoryCompliments: ComplimentData[] = [];

// Simple profanity filter - basic implementation
const PROFANITY_WORDS = [
    'damn', 'hell', 'shit', 'fuck', 'bitch', 'ass', 'bastard', 'crap',
    'piss', 'dick', 'cock', 'pussy', 'whore', 'slut', 'fag', 'nigger'
];

function containsProfanity(text: string): boolean {
    const lowerText = text.toLowerCase();
    return PROFANITY_WORDS.some(word => lowerText.includes(word));
}

function validateCompliment(message: string, sender: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!message || message.trim().length === 0) {
        errors.push('Compliment message is required');
    }

    if (message && message.trim().length > 500) {
        errors.push('Compliment message must be 500 characters or less');
    }

    if (!sender || sender.trim().length === 0) {
        errors.push('Sender name is required');
    }

    if (sender && sender.trim().length > 50) {
        errors.push('Sender name must be 50 characters or less');
    }

    if (message && containsProfanity(message)) {
        errors.push('Compliment contains inappropriate language');
    }

    if (sender && containsProfanity(sender)) {
        errors.push('Sender name contains inappropriate language');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Check if Redis is available
async function isRedisAvailable(): Promise<boolean> {
    try {
        // Check if environment variables are set
        return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
    } catch {
        return false;
    }
}

// Store compliment (Redis or in-memory)
async function storeCompliment(compliment: ComplimentData): Promise<void> {
    const redisAvailable = await isRedisAvailable();

    if (redisAvailable) {
        try {
            const redis = Redis.fromEnv();
            await redis.hset(compliment.id, compliment as Record<string, any>);

            if (compliment.isApproved) {
                await redis.lpush('approved_compliments', compliment.id);
            } else {
                await redis.lpush('moderation_queue', compliment.id);
            }
        } catch (error) {
            console.warn('Redis storage failed, falling back to in-memory:', error);
            // Fall back to in-memory storage
            inMemoryCompliments.push(compliment);
        }
    } else {
        // Use in-memory storage
        inMemoryCompliments.push(compliment);
    }
}

// Get random compliment (Redis or in-memory)
async function getRandomCompliment(): Promise<{ message: string; sender: string; timestamp: number; source: string } | null> {
    const redisAvailable = await isRedisAvailable();

    if (redisAvailable) {
        try {
            const redis = Redis.fromEnv();
            const approvedIds = await redis.lrange('approved_compliments', 0, -1);

            if (approvedIds && approvedIds.length > 0) {
                const randomId = approvedIds[Math.floor(Math.random() * approvedIds.length)];
                const complimentData = await redis.hgetall(randomId as string) as any as ComplimentData;

                if (complimentData && complimentData.message) {
                    return {
                        message: complimentData.message,
                        sender: complimentData.sender,
                        timestamp: complimentData.timestamp,
                        source: 'database'
                    };
                }
            }
        } catch (error) {
            console.warn('Redis retrieval failed, falling back to in-memory:', error);
        }
    }

    // Use in-memory storage or fallback
    const approvedCompliments = inMemoryCompliments.filter(c => c.isApproved);

    if (approvedCompliments.length > 0) {
        const randomCompliment = approvedCompliments[Math.floor(Math.random() * approvedCompliments.length)];
        return {
            message: randomCompliment.message,
            sender: randomCompliment.sender,
            timestamp: randomCompliment.timestamp,
            source: 'memory'
        };
    }

    // Return fallback compliments if none in storage
    const fallbackCompliments = [
        { message: "You're absolutely amazing and bring joy to everyone around you!", sender: "Anonymous Friend" },
        { message: "Your smile could light up the darkest room!", sender: "Secret Admirer" },
        { message: "You have such a wonderful way of making others feel special!", sender: "Grateful Soul" },
        { message: "Your kindness is a gift to the world!", sender: "Thankful Heart" },
        { message: "You're stronger than you know and braver than you feel!", sender: "Believer" },
        { message: "Your creativity inspires everyone around you!", sender: "Art Lover" },
        { message: "You make the world a better place just by being in it!", sender: "Optimist" },
        { message: "Your laugh is contagious and brightens everyone's day!", sender: "Joy Spreader" }
    ];

    const randomCompliment = fallbackCompliments[Math.floor(Math.random() * fallbackCompliments.length)];
    return {
        ...randomCompliment,
        timestamp: Date.now(),
        source: 'fallback'
    };
}

export async function POST(request: NextRequest) {
    if (!APIResponseUtil.validateMethod(request, ['POST'])) {
        return APIResponseUtil.methodNotAllowed(['POST']);
    }

    return APIResponseUtil.handleAsync(async () => {
        const body = await request.json();
        const { message, sender } = body;

        // Validate input
        const validation = validateCompliment(message, sender);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        // Create compliment data
        const complimentId = `compliment:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
        const complimentData: ComplimentData = {
            id: complimentId,
            message: message.trim(),
            sender: sender.trim(),
            timestamp: Date.now(),
            isModerated: true,
            isApproved: !containsProfanity(message) && !containsProfanity(sender),
            moderationFlags: containsProfanity(message) || containsProfanity(sender) ? ['profanity'] : []
        };

        // Store compliment
        await storeCompliment(complimentData);

        return {
            success: true,
            message: complimentData.isApproved
                ? 'Compliment sent successfully!'
                : 'Compliment submitted for review',
            complimentId: complimentData.id,
            needsModeration: !complimentData.isApproved
        };
    }, 'Compliment POST API');
}

export async function GET(request: NextRequest) {
    if (!APIResponseUtil.validateMethod(request, ['GET'])) {
        return APIResponseUtil.methodNotAllowed(['GET']);
    }

    return APIResponseUtil.handleAsync(async () => {
        const compliment = await getRandomCompliment();

        if (!compliment) {
            throw new Error('No compliments available');
        }

        return compliment;
    }, 'Compliment GET API');
}

export async function OPTIONS() {
    return APIResponseUtil.corsPreflightResponse();
}