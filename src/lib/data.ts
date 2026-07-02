import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  findDefaultGalleryBySlug,
  getDefaultGalleryImages,
  getDefaultVideos,
  getDefaultPublishedHero,
  getDefaultHeroSlides,
} from '@/lib/default-content';
import {
  resolvePublishedHero,
  resolveGalleryImages,
  resolveVideos,
  resolveFeaturedGalleryImages,
} from '@/lib/media-fallback';

export async function getPublishedHero() {
  noStore();
  try {
    const hero = await prisma.heroSection.findFirst({
      include: {
        slides: {
          where: { isDraft: false },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    return resolvePublishedHero(hero);
  } catch {
    return getDefaultPublishedHero();
  }
}

export async function getGalleryImages(options?: {
  category?: string;
  featured?: boolean;
}) {
  try {
    const images = await prisma.galleryImage.findMany({
      where: {
        ...(options?.category && options.category !== 'all'
          ? { category: options.category }
          : {}),
        ...(options?.featured ? { featured: true } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    if (options?.featured) {
      return resolveFeaturedGalleryImages(images);
    }

    return resolveGalleryImages(images);
  } catch {
    if (options?.featured) {
      return getDefaultGalleryImages().filter((img) => img.featured);
    }
    return getDefaultGalleryImages();
  }
}

export async function getVideos(category?: string) {
  try {
    const videos = await prisma.video.findMany({
      where:
        category && category !== 'all' ? { category } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return resolveVideos(videos);
  } catch {
    return getDefaultVideos();
  }
}

export async function getGalleryImageBySlug(slug: string) {
  try {
    const image = await prisma.galleryImage.findUnique({ where: { slug } });
    if (image) {
      const [resolved] = await resolveGalleryImages([image]);
      return resolved ?? image;
    }
    return findDefaultGalleryBySlug(slug) ?? null;
  } catch {
    return findDefaultGalleryBySlug(slug) ?? null;
  }
}

function pickDiverseGalleryImages<
  T extends { id: string; category: string | null },
>(items: T[], excludeId: string, currentCategory: string | null, limit: number): T[] {
  const pool = items.filter((item) => item.id !== excludeId);
  const otherCategories = pool.filter((item) => item.category !== currentCategory);
  const selected: T[] = [];

  for (const item of otherCategories) {
    if (selected.length >= limit) break;
    selected.push(item);
  }

  if (selected.length < limit) {
    for (const item of pool) {
      if (selected.length >= limit) break;
      if (!selected.some((picked) => picked.id === item.id)) {
        selected.push(item);
      }
    }
  }

  return selected.slice(0, limit);
}

export async function getRelatedGalleryImages(
  category: string | null,
  excludeId: string,
  limit = 4
) {
  try {
    const related = await prisma.galleryImage.findMany({
      where: { id: { not: excludeId } },
      orderBy: { sortOrder: 'asc' },
    });

    if (related.length > 0) {
      const resolved = await resolveGalleryImages(related);
      return pickDiverseGalleryImages(resolved, excludeId, category, limit);
    }

    const defaults = getDefaultGalleryImages();
    return pickDiverseGalleryImages(defaults, excludeId, category, limit);
  } catch {
    const defaults = getDefaultGalleryImages();
    return pickDiverseGalleryImages(defaults, excludeId, category, limit);
  }
}

export async function getAllGallerySlugs() {
  try {
    const slugs = await prisma.galleryImage.findMany({
      select: { slug: true },
    });
    if (slugs.length > 0) return slugs;
    return getDefaultGalleryImages().map((img) => ({ slug: img.slug }));
  } catch {
    return getDefaultGalleryImages().map((img) => ({ slug: img.slug }));
  }
}

export async function getGalleryCategories() {
  try {
    const results = await prisma.galleryImage.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    });
    const categories = results.map((r) => r.category).filter(Boolean) as string[];
    if (categories.length > 0) return categories;

    return [
      ...new Set(
        getDefaultGalleryImages()
          .map((img) => img.category)
          .filter(Boolean) as string[]
      ),
    ];
  } catch {
    return [
      ...new Set(
        getDefaultGalleryImages()
          .map((img) => img.category)
          .filter(Boolean) as string[]
      ),
    ];
  }
}

export async function getVideoCategories() {
  try {
    const results = await prisma.video.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    });
    const categories = results.map((r) => r.category).filter(Boolean) as string[];
    if (categories.length > 0) return categories;

    return [
      ...new Set(
        getDefaultVideos()
          .map((v) => v.category)
          .filter(Boolean) as string[]
      ),
    ];
  } catch {
    return [
      ...new Set(
        getDefaultVideos()
          .map((v) => v.category)
          .filter(Boolean) as string[]
      ),
    ];
  }
}

export async function getDashboardStats() {
  try {
    const [galleryCount, videoCount, slideCountInDb] = await Promise.all([
      prisma.galleryImage.count(),
      prisma.video.count(),
      prisma.heroSlide.count(),
    ]);

    const slideCount =
      slideCountInDb > 0 ? slideCountInDb : getDefaultHeroSlides().length;

    return { galleryCount, videoCount, slideCount };
  } catch {
    return {
      galleryCount: getDefaultGalleryImages().length,
      videoCount: getDefaultVideos().length,
      slideCount: getDefaultHeroSlides().length,
    };
  }
}

