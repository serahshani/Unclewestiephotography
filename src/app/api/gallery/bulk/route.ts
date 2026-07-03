import { NextRequest } from 'next/server';
import { revalidatePublicContent, revalidateGallerySlug } from '@/lib/revalidate';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { galleryBulkSchema } from '@/lib/validators';
import { deleteUploadedFile } from '@/lib/upload';
import { jsonError, jsonSuccess } from '@/lib/api-utils';

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

  const parsed = galleryBulkSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  const { ids, action, category } = parsed.data;

  if (action === 'setCategory' && !category) {
    return jsonError('Category is required for bulk category change');
  }

  const images = await prisma.galleryImage.findMany({
    where: { id: { in: ids } },
  });

  if (images.length === 0) {
    return jsonError('No matching images found', 404);
  }

  if (action === 'delete') {
    for (const image of images) {
      if (image.imagePath.startsWith('/uploads/')) {
        await deleteUploadedFile(image.imagePath);
      }
    }
    await prisma.galleryImage.deleteMany({ where: { id: { in: ids } } });
    revalidatePublicContent();
    for (const image of images) {
      revalidateGallerySlug(image.slug);
    }
    return jsonSuccess({ message: `${images.length} image(s) deleted`, count: images.length });
  }

  if (action === 'publish') {
    await prisma.galleryImage.updateMany({
      where: { id: { in: ids } },
      data: { published: true },
    });
    revalidatePublicContent();
    return jsonSuccess({ message: `${images.length} image(s) published`, count: images.length });
  }

  if (action === 'unpublish') {
    await prisma.galleryImage.updateMany({
      where: { id: { in: ids } },
      data: { published: false },
    });
    revalidatePublicContent();
    return jsonSuccess({ message: `${images.length} image(s) unpublished`, count: images.length });
  }

  await prisma.galleryImage.updateMany({
    where: { id: { in: ids } },
    data: { category },
  });
  revalidatePublicContent();
  return jsonSuccess({
    message: `Category updated for ${images.length} image(s)`,
    count: images.length,
  });
}
