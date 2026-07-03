import { NextRequest } from 'next/server';
import { revalidatePublicContent, revalidateGallerySlug } from '@/lib/revalidate';
import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { galleryCreateSchema } from '@/lib/validators';
import { jsonError, jsonSuccess } from '@/lib/api-utils';
import { resolveGalleryImages, resolveFeaturedGalleryImages } from '@/lib/media-fallback';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  const images = await prisma.galleryImage.findMany({
    where: {
      ...(category && category !== 'all' ? { category } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  const resolved =
    featured === 'true'
      ? await resolveFeaturedGalleryImages(images)
      : await resolveGalleryImages(images);

  return jsonSuccess(resolved);
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
        sortOrder: data.sortOrder ?? 0,
        featured: data.featured ?? false,
      },
    });
  });

  revalidatePublicContent();
  revalidateGallerySlug(slug);
  return jsonSuccess(image, 201);
}
