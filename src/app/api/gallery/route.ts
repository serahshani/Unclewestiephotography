import { NextRequest } from 'next/server';
import { revalidatePublicContent, revalidateGallerySlug } from '@/lib/revalidate';
import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { galleryCreateSchema } from '@/lib/validators';
import { jsonError, jsonSuccess } from '@/lib/api-utils';
import { resolveGalleryImages, resolveFeaturedGalleryImages } from '@/lib/media-fallback';
import type { Prisma } from '@/generated/prisma';

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((t): t is string => typeof t === 'string');
}

function serializeGalleryImage<T extends { tags?: unknown }>(image: T) {
  return {
    ...image,
    tags: parseTags(image.tags),
  };
}

function buildAdminWhere(params: URLSearchParams): Prisma.GalleryImageWhereInput {
  const category = params.get('category');
  const status = params.get('status');
  const featured = params.get('featured');
  const search = params.get('search')?.trim();
  const dateFrom = params.get('dateFrom');
  const dateTo = params.get('dateTo');

  const where: Prisma.GalleryImageWhereInput = {};

  if (category && category !== 'all') {
    where.category = category;
  }

  if (status === 'published') {
    where.published = true;
  } else if (status === 'draft') {
    where.published = false;
  }

  if (featured === 'true') {
    where.featured = true;
  } else if (featured === 'false') {
    where.featured = false;
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
      const images = await prisma.galleryImage.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      });

      return jsonSuccess({
        items: images.map(serializeGalleryImage),
        total: images.length,
        page: 1,
        pageSize: images.length,
        totalPages: 1,
      });
    }

    const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get('pageSize') ?? '24') || 24)
    );

    const [total, images] = await Promise.all([
      prisma.galleryImage.count({ where }),
      prisma.galleryImage.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return jsonSuccess({
      items: images.map(serializeGalleryImage),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  }

  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  const images = await prisma.galleryImage.findMany({
    where: {
      published: true,
      ...(category && category !== 'all' ? { category } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  const resolved =
    featured === 'true'
      ? await resolveFeaturedGalleryImages(images)
      : await resolveGalleryImages(images);

  return jsonSuccess(
    resolved.map((image) => ({
      ...image,
      tags: 'tags' in image && Array.isArray(image.tags)
        ? image.tags.filter((t): t is string => typeof t === 'string')
        : [],
    }))
  );
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

  const parsed = galleryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  const data = parsed.data;
  const baseSlug = slugify(data.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.galleryImage.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const image = await prisma.$transaction(async (tx) => {
    await tx.galleryImage.updateMany({
      data: { sortOrder: { increment: 1 } },
    });

    return tx.galleryImage.create({
      data: {
        title: data.title,
        description: data.description,
        imagePath: data.imagePath,
        altText: data.altText,
        slug,
        category: data.category,
        tags: data.tags ?? [],
        sortOrder: data.sortOrder ?? 0,
        featured: data.featured ?? false,
        published: data.published ?? false,
        photographerCredit: data.photographerCredit,
        fileSizeBytes: data.fileSizeBytes,
        width: data.width,
        height: data.height,
      },
    });
  });

  revalidatePublicContent();
  revalidateGallerySlug(slug);
  return jsonSuccess(serializeGalleryImage(image), 201);
}
