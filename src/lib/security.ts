const SAFE_REDIRECT_PREFIXES = ['/admin', '/admin/'];

export function getSafeRedirectPath(from: string | null, fallback = '/admin'): string {
  if (!from) return fallback;
  if (!from.startsWith('/') || from.startsWith('//')) return fallback;
  if (from.includes('://') || from.includes('\\')) return fallback;
  const isAllowed = SAFE_REDIRECT_PREFIXES.some(
    (prefix) => from === prefix.replace(/\/$/, '') || from.startsWith(prefix)
  );
  return isAllowed ? from : fallback;
}

export function getTrustedClientIp(request: Request): string {
  if (process.env.TRUST_PROXY === 'true') {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      const hops = forwarded.split(',').map((h) => h.trim());
      return hops[hops.length - 1] || 'unknown';
    }
    return request.headers.get('x-real-ip') ?? 'unknown';
  }
  return 'local';
}
