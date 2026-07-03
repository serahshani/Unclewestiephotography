import { NextRequest } from 'next/server';
import { revalidatePublicContent } from '@/lib/revalidate';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { jsonError, jsonSuccess } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  const hero = await prisma.heroSection.findFirst({
    include: { slides: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!hero) return jsonError('Hero section not found', 404);

  const typewriterWords =
    hero.draftTypewriterWords ?? hero.typewriterWords ?? ['Uncle Westiee', 'Studios'];

  const updated = await prisma.heroSection.update({
    where: { id: hero.id },
    data: {
      title: hero.draftTitle ?? hero.title,
      subtitle: hero.draftSubtitle ?? hero.subtitle,
      description: hero.draftDescription ?? hero.description,
      ctaText: hero.draftCtaText ?? hero.ctaText,
      ctaUrl: hero.draftCtaUrl ?? hero.ctaUrl,
      typewriterWords: typewriterWords as Prisma.InputJsonValue,
      logoPath: hero.draftLogoPath ?? hero.logoPath,
    },
  });

  // Promote new draft slides to live — keep existing published slides unless admin deletes them.
  await prisma.heroSlide.updateMany({
    where: { heroSectionId: hero.id, isDraft: true },
    data: { isDraft: false },
  });

  revalidatePublicContent();
  return jsonSuccess({ message: 'Hero published', hero: updated });
}
