import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { heroSlideSchema, heroSlideReorderSchema } from '@/lib/validators';
import { revalidatePublicContent } from '@/lib/revalidate';
import { jsonError, jsonSuccess } from '@/lib/api-utils';
import { resolveHeroSlides } from '@/lib/media-fallback';

async function getHeroId(): Promise<string> {
  let hero = await prisma.heroSection.findFirst();
  if (!hero) {
    hero = await prisma.heroSection.create({
      data: {
        title: 'Uncle Westiee Studios',
        draftTitle: 'Uncle Westiee Studios',
      },
    });
  }
  return hero.id;
}

export async function GET(request: NextRequest) {
  const preview = request.nextUrl.searchParams.get('preview') === 'true';
  const heroId = await getHeroId();

  if (preview) {
    const session = await getSessionFromRequest(request);
    if (!session) return jsonError('Unauthorized', 401);
    const slides = await prisma.heroSlide.findMany({
      where: { heroSectionId: heroId },
      orderBy: { sortOrder: 'asc' },
    });
    return jsonSuccess(slides);
  }

  const slides = await prisma.heroSlide.findMany({
    where: { heroSectionId: heroId, isDraft: false },
    orderBy: { sortOrder: 'asc' },
  });
  return jsonSuccess(await resolveHeroSlides(slides, heroId));
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

  const parsed = heroSlideSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  const heroId = await getHeroId();
  const maxOrder = await prisma.heroSlide.aggregate({
    where: { heroSectionId: heroId },
    _max: { sortOrder: true },
  });

  const slide = await prisma.heroSlide.create({
    data: {
      heroSectionId: heroId,
      imagePath: parsed.data.imagePath,
      altText: parsed.data.altText,
      sortOrder: parsed.data.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
      isDraft: parsed.data.isDraft ?? true,
    },
  });

  return jsonSuccess(slide, 201);
}

export async function PUT(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid request body');
  }

  const parsed = heroSlideReorderSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  await Promise.all(
    parsed.data.map((item) =>
      prisma.heroSlide.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  revalidatePublicContent();
  return jsonSuccess({ message: 'Slides reordered' });}
