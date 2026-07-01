import { NextRequest } from 'next/server';
import { revalidatePublicContent } from '@/lib/revalidate';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { videoCreateSchema } from '@/lib/validators';
import { extractYouTubeId } from '@/lib/youtube';
import { jsonError, jsonSuccess } from '@/lib/api-utils';
import { resolveVideos } from '@/lib/media-fallback';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');

  const videos = await prisma.video.findMany({
    where: category && category !== 'all' ? { category } : undefined,
    orderBy: { sortOrder: 'asc' },
  });

  return jsonSuccess(await resolveVideos(videos));
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid request body');
  }

  const parsed = videoCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  const youtubeId = extractYouTubeId(parsed.data.youtubeUrl);
  if (!youtubeId) {
    return jsonError('Invalid YouTube URL');
  }

  const maxOrder = await prisma.video.aggregate({
    _max: { sortOrder: true },
  });

  const video = await prisma.video.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      youtubeUrl: parsed.data.youtubeUrl,
      youtubeId,
      category: parsed.data.category,
      sortOrder: parsed.data.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidatePublicContent();
  return jsonSuccess(video, 201);
}
