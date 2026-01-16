import { LRUCache } from 'lru-cache';

// Rate limiter configuration
const rateLimitOptions = {
  max: 500, // Max number of items in cache
  ttl: 60 * 1000, // 1 minute window
};

const rateLimitCache = new LRUCache(rateLimitOptions);

// Response cache for API responses
const responseCacheOptions = {
  max: 100,
  ttl: 5 * 60 * 1000, // 5 minutes
};

const responseCache = new LRUCache(responseCacheOptions);

/**
 * Rate limiter middleware
 * @param {string} identifier - Unique identifier (IP, user ID, etc.)
 * @param {number} limit - Max requests per window
 * @returns {object} - { success: boolean, remaining: number, reset: number }
 */
export function rateLimit(identifier, limit = 10) {
  const tokenCount = rateLimitCache.get(identifier) || 0;
  
  if (tokenCount >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(rateLimitOptions.ttl / 1000)
    };
  }
  
  rateLimitCache.set(identifier, tokenCount + 1);
  
  return {
    success: true,
    remaining: limit - tokenCount - 1,
    reset: Math.ceil(rateLimitOptions.ttl / 1000)
  };
}

/**
 * Get cached response
 * @param {string} key - Cache key
 * @returns {any} - Cached value or undefined
 */
export function getCachedResponse(key) {
  return responseCache.get(key);
}

/**
 * Set cached response
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Optional TTL in milliseconds
 */
export function setCachedResponse(key, value, ttl) {
  responseCache.set(key, value, { ttl: ttl || responseCacheOptions.ttl });
}

/**
 * Clear specific cache entry
 * @param {string} key - Cache key
 */
export function clearCache(key) {
  responseCache.delete(key);
}

/**
 * Generate cache key from request parameters
 * @param {string} prefix - Key prefix
 * @param {object} params - Parameters to include in key
 * @returns {string} - Cache key
 */
export function generateCacheKey(prefix, params) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${prefix}:${sortedParams}`;
}
