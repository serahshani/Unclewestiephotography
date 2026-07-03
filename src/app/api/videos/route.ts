import { NextRequest } from 'next/server';
import { revalidatePublicContent } from '@/lib/revalidate';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { videoCreateSchema } from '@/lib/validators';
import { buildVideoCreateData } from '@/lib/video-source';
import { jsonError, jsonSuccess } from '@/lib/api-utils';
import { resolveVideos } from '@/lib/media-fallback';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');

  const videos = await prisma.video.findMany({
    where: category && category !== 'all' ? { category } : undefined,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
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

  const built = buildVideoCreateData(parsed.data);
  if (built.error) return jsonError(built.error);

  const video = await prisma.$transaction(async (tx) => {
    await tx.video.updateMany({
      data: { sortOrder: { increment: 1 } },
    });

    return tx.video.create({
      data: {
        title: built.data.title,
        description: built.data.description ?? null,
        category: built.data.category ?? null,
        sourceType: built.data.sourceType,
        youtubeUrl: built.data.youtubeUrl ?? null,
        youtubeId: built.data.youtubeId ?? null,
        videoPath: built.data.videoPath ?? null,
        sortOrder: parsed.data.sortOrder ?? 0,
      },
    });
  });

  revalidatePublicContent();
  return jsonSuccess(video, 201);
}
