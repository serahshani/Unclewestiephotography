import { SignJWT, jwtVerify } from 'jose';
import { isTokenRevokedInMemory } from '@/lib/token-revocation-memory';

const TOKEN_COOKIE = 'admin_token';
const CSRF_COOKIE = 'csrf_token';
const TOKEN_EXPIRY = '8h';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export interface AdminTokenPayload {
  sub: string;
  username: string;
  jti?: string;
}

export async function verifyToken(
  token: string
): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.sub || typeof payload.username !== 'string') {
      return null;
    }

    const jti = typeof payload.jti === 'string' ? payload.jti : undefined;
    if (jti && isTokenRevokedInMemory(jti)) {
      return null;
    }

    return { sub: payload.sub, username: payload.username, jti };
  } catch {
    return null;
  }
}

export async function signToken(payload: AdminTokenPayload): Promise<string> {
  const jti = crypto.randomUUID();
  return new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getJwtSecret());
}

export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

export function validateCsrf(
  request: Request,
  csrfCookieName = CSRF_COOKIE
): boolean {
  const headerToken = request.headers.get('X-CSRF-Token');
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${csrfCookieName}=([^;]*)`));
  const cookieToken = match ? decodeURIComponent(match[1]) : null;
  return Boolean(headerToken && cookieToken && headerToken === cookieToken);
}

export const AUTH_COOKIES = {
  TOKEN: TOKEN_COOKIE,
  CSRF: CSRF_COOKIE,
} as const;

export function getAuthCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    path: '/',
  };
}

export function getCsrfCookieOptions(isProduction: boolean) {
  return {
    httpOnly: false,
    secure: isProduction,
    sameSite: 'strict' as const,
    path: '/',
  };
}
