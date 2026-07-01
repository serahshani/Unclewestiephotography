import { getRedisClient } from '@/lib/redis';
import {
  isTokenRevokedInMemory,
  revokeTokenInMemory,
} from '@/lib/token-revocation-memory';

const REVOKED_PREFIX = 'revoked:jti:';
const TOKEN_TTL_SECONDS = 8 * 60 * 60;

export async function revokeToken(jti: string, expiresAtMs?: number): Promise<void> {
  const expiresAt = expiresAtMs ?? Date.now() + TOKEN_TTL_SECONDS * 1000;
  const ttlSeconds = Math.max(1, Math.ceil((expiresAt - Date.now()) / 1000));

  revokeTokenInMemory(jti, expiresAt);

  const redis = await getRedisClient();
  if (redis) {
    await redis.set(`${REVOKED_PREFIX}${jti}`, '1', { EX: ttlSeconds });
  }
}

export async function isTokenRevoked(jti: string): Promise<boolean> {
  if (isTokenRevokedInMemory(jti)) return true;

  const redis = await getRedisClient();
  if (!redis) return false;

  const value = await redis.get(`${REVOKED_PREFIX}${jti}`);
  return value === '1';
}
