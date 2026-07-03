import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import {
  signToken,
  verifyToken,
  generateCsrfToken,
  validateCsrf,
  AUTH_COOKIES,
  getAuthCookieOptions,
  getCsrfCookieOptions,
  type AdminTokenPayload,
} from '@/lib/auth-edge';

export type { AdminTokenPayload };
export {
  signToken,
  verifyToken,
  generateCsrfToken,
  validateCsrf,
  AUTH_COOKIES,
  getAuthCookieOptions,
  getCsrfCookieOptions,
};

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSessionFromCookies(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  if (!token) return null;
  const session = await verifyToken(token);
  if (!session?.jti) return session;

  const { isTokenRevoked } = await import('@/lib/token-revocation');
  if (await isTokenRevoked(session.jti)) return null;
  return session;
}

export async function getSessionFromRequest(
  request: NextRequest
): Promise<AdminTokenPayload | null> {
  const token = request.cookies.get(AUTH_COOKIES.TOKEN)?.value;
  if (!token) return null;
  const session = await verifyToken(token);
  if (!session?.jti) return session;

  const { isTokenRevoked } = await import('@/lib/token-revocation');
  if (await isTokenRevoked(session.jti)) return null;
  return session;
}
