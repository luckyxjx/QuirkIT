import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock Vercel KV
jest.mock('@vercel/kv', () => ({
  kv: {
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    hset: jest.fn(),
    hgetall: jest.fn(),
    sadd: jest.fn(),
    smembers: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
  }
}))

// Mock Next.js NextRequest
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, options = {}) => ({
    url,
    method: options.method || 'GET',
    headers: new Map(Object.entries(options.headers || {})),
    nextUrl: new URL(url)
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((data, options = {}) => ({
      json: async () => data,
      status: options.status || 200,
      headers: new Map(Object.entries(options.headers || {}))
    }))
  }
}));

// Mock environment variables
process.env.NODE_ENV = 'test'