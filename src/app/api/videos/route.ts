import { NextRequest } from 'next/server';
import { revalidatePublicContent } from '@/lib/revalidate';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { videoCreateSchema } from '@/lib/validators';
import { buildVideoCreateData } from '@/lib/video-source';
import { jsonError, jsonSuccess } from '@/lib/api-utils';
import { resolveVideos } from '@/lib/media-fallback';
import type { Prisma } from '@/generated/prisma';

function buildAdminWhere(params: URLSearchParams): Prisma.VideoWhereInput {
  const category = params.get('category');
  const sourceType = params.get('sourceType');
  const search = params.get('search')?.trim();
  const dateFrom = params.get('dateFrom');
  const dateTo = params.get('dateTo');

  const where: Prisma.VideoWhereInput = {};

  if (category && category !== 'all') {
    where.category = category;
  }

  if (sourceType === 'youtube' || sourceType === 'upload') {
    where.sourceType = sourceType;
  }

  if (search) {
    where.title = { contains: search };
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  return where;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const isAdmin = searchParams.get('admin') === 'true';

  if (isAdmin) {
    const session = await getSessionFromRequest(request);
    if (!session) return jsonError('Unauthorized', 401);

    const where = buildAdminWhere(searchParams);
    const fetchAll = searchParams.get('all') === 'true';

    if (fetchAll) {
      const videos = await prisma.video.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      });

      return jsonSuccess({
        items: videos,
        total: videos.length,
        page: 1,
        pageSize: videos.length,
        totalPages: 1,
      });
    }

    const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get('pageSize') ?? '24') || 24)
    );

    const [total, videos] = await Promise.all([
      prisma.video.count({ where }),
      prisma.video.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return jsonSuccess({
      items: videos,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  }

  const category = searchParams.get('category');

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
