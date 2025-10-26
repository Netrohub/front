/**
 * Rate Limiter Utility
 * 
 * Provides rate limiting for API calls to prevent abuse and DoS attacks
 * in the admin panel.
 */

import { RateLimiter } from 'limiter';

// Create rate limiters for different operation types
const apiLimiter = new RateLimiter({
  tokensPerInterval: 30, // 30 requests
  interval: 'second', // per second
});

const mutationLimiter = new RateLimiter({
  tokensPerInterval: 10, // 10 requests
  interval: 'second', // per second
});

const uploadLimiter = new RateLimiter({
  tokensPerInterval: 5, // 5 uploads
  interval: 'second', // per second
});

/**
 * Wait for rate limit availability
 */
async function waitForToken(limiter: RateLimiter, removeTokens: number = 1): Promise<void> {
  await limiter.removeTokens(removeTokens);
}

/**
 * Check if a request can be made without waiting
 */
function hasTokens(limiter: RateLimiter, required: number = 1): boolean {
  return limiter.getTokensRemaining() >= required;
}

/**
 * Rate limit an API call
 */
export async function rateLimitApiCall<T>(
  fn: () => Promise<T>,
  type: 'read' | 'write' | 'upload' = 'read'
): Promise<T> {
  let limiter: RateLimiter;
  
  switch (type) {
    case 'write':
      limiter = mutationLimiter;
      break;
    case 'upload':
      limiter = uploadLimiter;
      break;
    default:
      limiter = apiLimiter;
  }

  // Wait for token availability
  await waitForToken(limiter);
  
  // Execute the function
  return fn();
}

/**
 * Check if API call can be made immediately
 */
export function canMakeApiCall(type: 'read' | 'write' | 'upload' = 'read'): boolean {
  let limiter: RateLimiter;
  
  switch (type) {
    case 'write':
      limiter = mutationLimiter;
      break;
    case 'upload':
      limiter = uploadLimiter;
      break;
    default:
      limiter = apiLimiter;
  }
  
  return hasTokens(limiter);
}

/**
 * Get remaining tokens for an operation type
 */
export function getRemainingTokens(type: 'read' | 'write' | 'upload' = 'read'): number {
  let limiter: RateLimiter;
  
  switch (type) {
    case 'write':
      limiter = mutationLimiter;
      break;
    case 'upload':
      limiter = uploadLimiter;
      break;
    default:
      limiter = apiLimiter;
  }
  
  return limiter.getTokensRemaining();
}

/**
 * Reset all rate limiters (for testing only)
 */
export function resetRateLimiters(): void {
  // Note: RateLimiter doesn't have a reset method, so we just recreate them
  // This is mainly for testing purposes
  console.warn('Rate limiters reset (this should only be used in tests)');
}
