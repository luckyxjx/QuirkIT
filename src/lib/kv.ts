import { kv } from '@vercel/kv';

export { kv };

// KV utility functions
export const kvUtils = {
  // Cache utilities
  async setCache<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
    await kv.setex(key, ttlSeconds, JSON.stringify(data));
  },

  async getCache<T>(key: string): Promise<T | null> {
    const data = await kv.get(key);
    return data ? JSON.parse(data as string) : null;
  },

  async deleteCache(key: string): Promise<void> {
    await kv.del(key);
  },

  // Compliment utilities
  async storeCompliment(compliment: {
    id: string;
    text: string;
    created_at: string;
    flag_count: number;
    status: string;
  }): Promise<void> {
    await kv.hset(`compliment:${compliment.id}`, compliment);
    await kv.sadd('compliments:active', compliment.id);
  },

  async getRandomCompliment(): Promise<Record<string, string> | null> {
    const activeIds = await kv.smembers('compliments:active');
    if (activeIds.length === 0) return null;
    
    const randomId = activeIds[Math.floor(Math.random() * activeIds.length)];
    return await kv.hgetall(`compliment:${randomId}`);
  },

  // Daily quote cache
  async setDailyQuote(date: string, quote: Record<string, unknown>): Promise<void> {
    await kv.setex(`cache:quote:daily:${date}`, 86400, JSON.stringify(quote)); // 24 hours
  },

  async getDailyQuote(date: string): Promise<Record<string, unknown> | null> {
    const data = await kv.get(`cache:quote:daily:${date}`);
    return data ? JSON.parse(data as string) : null;
  },

  // Generic cache utilities with TTL
  async setCacheWithTTL<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    await kv.setex(key, ttlSeconds, JSON.stringify({
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds
    }));
  },

  async getCacheWithTTL<T>(key: string): Promise<T | null> {
    const cached = await kv.get(key);
    if (!cached) return null;
    
    try {
      const parsed = JSON.parse(cached as string);
      const now = Date.now();
      const age = (now - parsed.timestamp) / 1000;
      
      if (age > parsed.ttl) {
        await kv.del(key);
        return null;
      }
      
      return parsed.data;
    } catch {
      await kv.del(key);
      return null;
    }
  },

  // API health tracking
  async setAPIHealth(apiName: string, isHealthy: boolean): Promise<void> {
    await kv.setex(`health:${apiName}`, 300, JSON.stringify({
      healthy: isHealthy,
      lastCheck: Date.now()
    }));
  },

  async getAPIHealth(apiName: string): Promise<{healthy: boolean; lastCheck: number} | null> {
    const data = await kv.get(`health:${apiName}`);
    return data ? JSON.parse(data as string) : null;
  },

  // Rate limiting utilities
  async checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<{allowed: boolean; remaining: number}> {
    // Simple rate limiting using a counter with expiration
    const currentCount = await kv.get(`rate:${key}`) || 0;
    
    if (Number(currentCount) >= limit) {
      return { allowed: false, remaining: 0 };
    }
    
    // Increment counter
    const newCount = await kv.incr(`rate:${key}`);
    
    // Set expiration on first request
    if (newCount === 1) {
      await kv.expire(`rate:${key}`, windowSeconds);
    }
    
    return { allowed: true, remaining: limit - newCount };
  }
};