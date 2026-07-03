import { NextRequest } from 'next/server';
import { revalidatePublicContent, revalidateGallerySlug } from '@/lib/revalidate';
import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { galleryUpdateSchema } from '@/lib/validators';
import { deleteUploadedFile } from '@/lib/upload';
import { jsonError, jsonSuccess } from '@/lib/api-utils';
import { normalizeImagePath } from '@/lib/image-path';

function serializeGalleryRecord<T extends { tags?: unknown; imagePath?: string }>(image: T) {
  return {
    ...image,
    imagePath: normalizeImagePath(image.imagePath) || image.imagePath,
    tags: Array.isArray(image.tags)
      ? image.tags.filter((t): t is string => typeof t === 'string')
      : [],
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return jsonError('Image not found', 404);
  return jsonSuccess(serializeGalleryRecord(image));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  const { id } = await params;
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) return jsonError('Image not found', 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid request body');
  }

  const parsed = galleryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  const data = parsed.data;

  if (
    data.imagePath &&
    data.imagePath !== existing.imagePath &&
    existing.imagePath.startsWith('/uploads/')
  ) {
    await deleteUploadedFile(existing.imagePath);
  }

  let slug = existing.slug;
  if (data.title && data.title !== existing.title) {
    const baseSlug = slugify(data.title, { lower: true, strict: true });
    slug = baseSlug;
    let counter = 1;
    while (
      await prisma.galleryImage.findFirst({
        where: { slug, NOT: { id } },
      })
    ) {
      slug = `${baseSlug}-${counter++}`;
    }
  }

  const { tags, ...rest } = data;

  const image = await prisma.galleryImage.update({
    where: { id },
    data: {
      ...rest,
      ...(tags !== undefined ? { tags: tags ?? [] } : {}),
      slug,
    },
  });

  revalidatePublicContent();
  revalidateGallerySlug(image.slug);
  if (existing.slug !== image.slug) revalidateGallerySlug(existing.slug);
  return jsonSuccess(serializeGalleryRecord(image));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  const { id } = await params;
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) return jsonError('Image not found', 404);

  if (existing.imagePath.startsWith('/uploads/')) {
    await deleteUploadedFile(existing.imagePath);
  }

  await prisma.galleryImage.delete({ where: { id } });
  revalidatePublicContent();
  revalidateGallerySlug(existing.slug);
  return jsonSuccess({ message: 'Image deleted' });
}
