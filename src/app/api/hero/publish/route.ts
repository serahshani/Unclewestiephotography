import { NextRequest } from 'next/server';
import { revalidatePublicContent } from '@/lib/revalidate';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { jsonError, jsonSuccess } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  const hero = await prisma.heroSection.findFirst();
  if (!hero) return jsonError('Hero section not found', 404);

  const updated = await prisma.heroSection.update({
    where: { id: hero.id },
    data: {
      title: hero.draftTitle ?? hero.title,
      subtitle: hero.draftSubtitle ?? hero.subtitle,
      description: hero.draftDescription ?? hero.description,
      ctaText: hero.draftCtaText ?? hero.ctaText,
      ctaUrl: hero.draftCtaUrl ?? hero.ctaUrl,
      typewriterWords:
        hero.draftTypewriterWords === null
          ? Prisma.JsonNull
          : ((hero.draftTypewriterWords ?? hero.typewriterWords) as Prisma.InputJsonValue),
      logoPath: hero.draftLogoPath ?? hero.logoPath,
    },
  });

  await prisma.heroSlide.deleteMany({
    where: { heroSectionId: hero.id, isDraft: false },
  });

  await prisma.heroSlide.updateMany({
    where: { heroSectionId: hero.id, isDraft: true },
    data: { isDraft: false },
  });

  revalidatePublicContent();
  return jsonSuccess({ message: 'Hero published', hero: updated });
}
