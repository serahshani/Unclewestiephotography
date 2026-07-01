import { getRedisClient } from '@/lib/redis';

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;
const WINDOW_MS = WINDOW_SECONDS * 1000;
const RATE_PREFIX = 'rate:login:';

type MemoryRecord = { count: number; resetAt: number };
const memoryAttempts = new Map<string, MemoryRecord>();

function checkMemoryRateLimit(ip: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const record = memoryAttempts.get(ip);

  if (!record || now > record.resetAt) {
    memoryAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return { allowed: true };
}

async function checkRedisRateLimit(ip: string): Promise<{
  allowed: boolean;
  retryAfter?: number;
}> {
  const redis = await getRedisClient();
  if (!redis) return checkMemoryRateLimit(ip);

  const key = `${RATE_PREFIX}${ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
    return { allowed: true };
  }

  if (count > MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: WINDOW_SECONDS };
  }

  return { allowed: true };
}

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  retryAfter?: number;
}> {
  return checkRedisRateLimit(ip);
}

export async function resetRateLimit(ip: string): Promise<void> {
  memoryAttempts.delete(ip);
  const redis = await getRedisClient();
  if (redis) await redis.del(`${RATE_PREFIX}${ip}`);
}
