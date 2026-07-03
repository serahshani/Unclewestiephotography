import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError, jsonSuccess } from '@/lib/api-utils';

const VIEW_RATE_PREFIX = 'rate:gallery-view:';
const MAX_VIEWS_PER_WINDOW = 60;
const WINDOW_SECONDS = 60;

type MemoryRecord = { count: number; resetAt: number };
const memoryAttempts = new Map<string, MemoryRecord>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function checkViewRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `${VIEW_RATE_PREFIX}${ip}`;
  const record = memoryAttempts.get(key);

  if (!record || now > record.resetAt) {
    memoryAttempts.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return true;
  }

  if (record.count >= MAX_VIEWS_PER_WINDOW) return false;

  record.count += 1;
  return true;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  if (!checkViewRateLimit(ip)) {
    return jsonError('Too many requests', 429);
  }

  const { id } = await params;

  if (!id || id.startsWith('default-gallery-')) {
    return jsonError('Image not found', 404);
  }

  const existing = await prisma.galleryImage.findUnique({
    where: { id },
    select: { id: true, published: true },
  });

  if (!existing || !existing.published) {
    return jsonError('Image not found', 404);
  }

  const updated = await prisma.galleryImage.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    select: { viewCount: true },
  });

  return jsonSuccess({ viewCount: updated.viewCount });
}
