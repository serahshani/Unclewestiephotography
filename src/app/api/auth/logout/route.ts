import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import {
  AUTH_COOKIES,
  validateCsrf,
  getAuthCookieOptions,
  getCsrfCookieOptions,
} from '@/lib/auth-edge';
import { revokeToken } from '@/lib/token-revocation';
import { jsonError, jsonSuccess, isProduction } from '@/lib/api-utils';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return new TextEncoder().encode(secret);
}

export async function POST(request: NextRequest) {
  if (!validateCsrf(request)) {
    return jsonError('Invalid CSRF token', 403);
  }

  const token = request.cookies.get(AUTH_COOKIES.TOKEN)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      const jti = typeof payload.jti === 'string' ? payload.jti : undefined;
      const expiresAt =
        typeof payload.exp === 'number' ? payload.exp * 1000 : undefined;
      if (jti) await revokeToken(jti, expiresAt);
    } catch {
      // Token already invalid — still clear cookies below.
    }
  }

  const prod = isProduction();
  const response = jsonSuccess({ message: 'Logged out' });
  response.cookies.set(AUTH_COOKIES.TOKEN, '', {
    ...getAuthCookieOptions(prod),
    maxAge: 0,
  });
  response.cookies.set(AUTH_COOKIES.CSRF, '', {
    ...getCsrfCookieOptions(prod),
    maxAge: 0,
  });
  return response;
}
