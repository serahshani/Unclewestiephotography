import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AUTH_COOKIES } from '@/lib/auth-edge';

const PUBLIC_API_GET = [
  '/api/hero',
  '/api/gallery',
  '/api/videos',
];
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(AUTH_COOKIES.TOKEN)?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    const token = request.cookies.get(AUTH_COOKIES.TOKEN)?.value;
    const session = token ? await verifyToken(token) : null;
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    const method = request.method;
    const isPublicGet =
      method === 'GET' &&
      PUBLIC_API_GET.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );

    if (isPublicGet) {
      return NextResponse.next();
    }

    if (
      pathname.startsWith('/api/auth/login') &&
      method === 'POST'
    ) {
      return NextResponse.next();
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      return NextResponse.next();
    }

    if (
      method === 'POST' &&
      /^\/api\/gallery\/[^/]+\/view$/.test(pathname)
    ) {
      return NextResponse.next();
    }

    if (MUTATING_METHODS.has(method) || pathname.startsWith('/api/auth/')) {
      const token = request.cookies.get(AUTH_COOKIES.TOKEN)?.value;
      const session = token ? await verifyToken(token) : null;
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
