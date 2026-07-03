import { NextRequest } from 'next/server';
import { revalidatePublicContent } from '@/lib/revalidate';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { videoBulkSchema } from '@/lib/validators';
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

  const parsed = videoBulkSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  const { ids, action, category } = parsed.data;

  if (action === 'setCategory' && !category) {
    return jsonError('Category is required for bulk category change');
  }

  const videos = await prisma.video.findMany({
    where: { id: { in: ids } },
  });

  if (videos.length === 0) {
    return jsonError('No matching videos found', 404);
  }

  if (action === 'delete') {
    for (const video of videos) {
      if (video.sourceType === 'upload' && video.videoPath) {
        await deleteUploadedFile(video.videoPath);
      }
    }
    await prisma.video.deleteMany({ where: { id: { in: ids } } });
    revalidatePublicContent();
    return jsonSuccess({ message: `${videos.length} video(s) deleted`, count: videos.length });
  }

  await prisma.video.updateMany({
    where: { id: { in: ids } },
    data: { category },
  });
  revalidatePublicContent();
  return jsonSuccess({
    message: `Category updated for ${videos.length} video(s)`,
    count: videos.length,
  });
}
