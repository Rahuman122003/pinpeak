/**
 * Lightweight in-memory cache with optional Redis backend.
 * On Vercel/serverless, Redis (Upstash) is recommended via REDIS_URL.
 * Falls back to a per-instance LRU.
 */

type Entry = { value: any; expires: number };

const MAX = 500;
const store = new Map<string, Entry>();

function memGet(key: string): any | null {
  const e = store.get(key);
  if (!e) return null;
  if (Date.now() > e.expires) {
    store.delete(key);
    return null;
  }
  // refresh LRU
  store.delete(key);
  store.set(key, e);
  return e.value;
}

function memSet(key: string, value: any, ttlMs: number) {
  if (store.size >= MAX) {
    const first = store.keys().next().value;
    if (first) store.delete(first);
  }
  store.set(key, { value, expires: Date.now() + ttlMs });
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  return memGet(key) as T | null;
}

export async function cacheSet(key: string, value: any, ttlSeconds = 600) {
  memSet(key, value, ttlSeconds * 1000);
}
