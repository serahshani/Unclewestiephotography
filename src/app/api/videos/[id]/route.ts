import { NextRequest } from 'next/server';
import { revalidatePublicContent } from '@/lib/revalidate';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { videoUpdateSchema } from '@/lib/validators';
import { buildVideoUpdateData } from '@/lib/video-source';
import { deleteUploadedFile } from '@/lib/upload';
import { jsonError, jsonSuccess } from '@/lib/api-utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) return jsonError('Video not found', 404);
  return jsonSuccess(video);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  const { id } = await params;
  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) return jsonError('Video not found', 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid request body');
  }

  const parsed = videoUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  const { title, description, category, sortOrder, sourceType, youtubeUrl, videoPath } =
    parsed.data;

  const built = buildVideoUpdateData(existing, {
    sourceType,
    youtubeUrl,
    videoPath,
  });
  if (built.error) return jsonError(built.error);

  const video = await prisma.video.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(sortOrder !== undefined ? { sortOrder } : {}),
      ...built.data,
    },
  });

  if (built.deleteVideoPath) {
    await deleteUploadedFile(built.deleteVideoPath);
  }

  revalidatePublicContent();
  return jsonSuccess(video);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  const { id } = await params;
  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) return jsonError('Video not found', 404);

  await prisma.video.delete({ where: { id } });

  if (existing.sourceType === 'upload' && existing.videoPath) {
    await deleteUploadedFile(existing.videoPath);
  }

  revalidatePublicContent();
  return jsonSuccess({ message: 'Video deleted' });
}
