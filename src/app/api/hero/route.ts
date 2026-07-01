import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { heroUpdateSchema } from '@/lib/validators';
import { jsonError, jsonSuccess } from '@/lib/api-utils';
import { resolveDraftHero, resolvePublishedHero } from '@/lib/media-fallback';

async function getOrCreateHero() {
  let hero = await prisma.heroSection.findFirst({
    include: {
      slides: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!hero) {
    hero = await prisma.heroSection.create({
      data: {
        title: 'Uncle Westiee Studios',
        typewriterWords: ['Uncle Westiee', 'Studios'],
        draftTitle: 'Uncle Westiee Studios',
        draftTypewriterWords: ['Uncle Westiee', 'Studios'],
      },
      include: {
        slides: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }
  return hero;
}

async function formatPublicHero(hero: Awaited<ReturnType<typeof getOrCreateHero>>) {
  return resolvePublishedHero(hero);
}

async function formatDraftHero(hero: Awaited<ReturnType<typeof getOrCreateHero>>) {
  return resolveDraftHero(hero);
}

export async function GET(request: NextRequest) {
  const hero = await getOrCreateHero();
  const preview = request.nextUrl.searchParams.get('preview') === 'true';

  if (preview) {
    const session = await getSessionFromRequest(request);
    if (!session) return jsonError('Unauthorized', 401);
    return jsonSuccess(await formatDraftHero(hero));
  }

  return jsonSuccess(await formatPublicHero(hero));
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

  const parsed = heroUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input');
  }

  const hero = await getOrCreateHero();
  const data = parsed.data;

  const updateData: Prisma.HeroSectionUpdateInput = {};
  if (data.draftTitle !== undefined) updateData.draftTitle = data.draftTitle;
  if (data.draftSubtitle !== undefined) updateData.draftSubtitle = data.draftSubtitle;
  if (data.draftDescription !== undefined) updateData.draftDescription = data.draftDescription;
  if (data.draftCtaText !== undefined) updateData.draftCtaText = data.draftCtaText;
  if (data.draftCtaUrl !== undefined) updateData.draftCtaUrl = data.draftCtaUrl || null;
  if (data.draftTypewriterWords !== undefined) {
    updateData.draftTypewriterWords =
      data.draftTypewriterWords === null
        ? Prisma.JsonNull
        : data.draftTypewriterWords;
  }
  if (data.draftLogoPath !== undefined) updateData.draftLogoPath = data.draftLogoPath;

  const updated = await prisma.heroSection.update({
    where: { id: hero.id },
    data: updateData,
    include: { slides: { orderBy: { sortOrder: 'asc' } } },
  });

  return jsonSuccess(await formatDraftHero(updated));
}
