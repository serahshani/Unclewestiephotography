import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  signToken,
  verifyPassword,
  generateCsrfToken,
  AUTH_COOKIES,
  getAuthCookieOptions,
  getCsrfCookieOptions,
} from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validators';
import { jsonError, jsonSuccess, isProduction } from '@/lib/api-utils';
import { getTrustedClientIp } from '@/lib/security';
import { getDatabaseErrorMessage } from '@/lib/db-errors';

export async function POST(request: NextRequest) {
  try {
    const ip = getTrustedClientIp(request);
    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return jsonError(
        `Too many login attempts. Try again in ${rateCheck.retryAfter} seconds.`,
        429
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid request body');
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
    }

    const { username, password } = parsed.data;

    let admin;
    try {
      admin = await prisma.admin.findUnique({ where: { username } });
    } catch (dbError) {
      console.error('Login database error:', dbError);
      return jsonError(getDatabaseErrorMessage(dbError), 503);
    }

    if (!admin) {
      return jsonError('Invalid username or password', 401);
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return jsonError('Invalid username or password', 401);
    }

    await resetRateLimit(ip);
    const token = await signToken({ sub: admin.id, username: admin.username });
    const csrfToken = generateCsrfToken();
    const prod = isProduction();

    const response = jsonSuccess({ username: admin.username });
    response.cookies.set(AUTH_COOKIES.TOKEN, token, {
      ...getAuthCookieOptions(prod),
      maxAge: 60 * 60 * 8,
    });
    response.cookies.set(AUTH_COOKIES.CSRF, csrfToken, {
      ...getCsrfCookieOptions(prod),
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return jsonError('Something went wrong during sign in. Please try again.', 500);
  }
}
