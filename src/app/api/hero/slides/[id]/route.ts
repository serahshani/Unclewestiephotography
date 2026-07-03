import { NextRequest } from 'next/server';
import { revalidatePublicContent } from '@/lib/revalidate';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { heroSlideSchema } from '@/lib/validators';
import { deleteUploadedFile } from '@/lib/upload';
import { jsonError, jsonSuccess } from '@/lib/api-utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide || slide.isDraft) return jsonError('Slide not found', 404);
  return jsonSuccess(slide);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  const { id } = await params;
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) return jsonError('Slide not found', 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid request body');
  }

  const parsed = heroSlideSchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  if (
    parsed.data.imagePath &&
    parsed.data.imagePath !== existing.imagePath &&
    existing.imagePath.startsWith('/uploads/')
  ) {
    await deleteUploadedFile(existing.imagePath);
  }

  const slide = await prisma.heroSlide.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePublicContent();
  return jsonSuccess(slide);}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  const { id } = await params;
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) return jsonError('Slide not found', 404);

  if (existing.imagePath.startsWith('/uploads/')) {
    await deleteUploadedFile(existing.imagePath);
  }

  await prisma.heroSlide.delete({ where: { id } });
  revalidatePublicContent();
  return jsonSuccess({ message: 'Slide deleted' });}
