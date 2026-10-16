// High-performance in-memory cache for API endpoints
// Drastically cuts down multi-second Neon US-East database latency to < 10ms for recurring requests.

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const globalCache = globalThis as unknown as {
  __apiCache?: Map<string, CacheEntry<any>>;
};

if (!globalCache.__apiCache) {
  globalCache.__apiCache = new Map();
}

const cache = globalCache.__apiCache;

/**
 * Retrieve cached data if valid and not expired
 */
export function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

/**
 * Store data in cache with TTL (defaults to 30 seconds)
 */
export function cacheSet<T>(key: string, data: T, ttlMs = 30000): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Invalidate all cache entries matching prefix (e.g. 'tasks', 'users', 'requests')
 */
export function cacheInvalidate(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}
