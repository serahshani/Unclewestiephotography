type RedisClient = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<unknown>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
  del(key: string): Promise<unknown>;
};

let client: RedisClient | null | undefined;

export function isRedisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL?.trim());
}

export async function getRedisClient(): Promise<RedisClient | null> {
  if (client !== undefined) return client;

  const url = process.env.REDIS_URL?.trim();
  if (!url) {
    client = null;
    return client;
  }

  try {
    const { createClient } = await import('redis');
    const redis = createClient({ url });
    redis.on('error', () => {});
    if (!redis.isOpen) await redis.connect();
    client = redis as unknown as RedisClient;
  } catch {
    client = null;
  }

  return client;
}
