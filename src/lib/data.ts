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
      orderBy: { sortOrder: 'asc' },
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
      orderBy: { sortOrder: 'asc' },
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

export async function getRelatedGalleryImages(
  category: string | null,
  excludeId: string,
  limit = 4
) {
  try {
    const related = await prisma.galleryImage.findMany({
      where: {
        id: { not: excludeId },
        ...(category ? { category } : {}),
      },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });

    if (related.length > 0) {
      return resolveGalleryImages(related);
    }

    const defaults = getDefaultGalleryImages().filter(
      (img) => img.id !== excludeId && (!category || img.category === category)
    );
    return defaults.slice(0, limit);
  } catch {
    const defaults = getDefaultGalleryImages().filter(
      (img) => !category || img.category === category
    );
    return defaults.filter((img) => img.id !== excludeId).slice(0, limit);
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

