import { access } from 'fs/promises';
import path from 'path';
import { resolveUploadFilePath } from '@/lib/upload';
import {
  DEFAULT_LOGO_PATH,
  DEFAULT_TYPEWRITER_WORDS,
  DEFAULT_HERO_META,
  getDefaultGalleryImages,
  getDefaultVideos,
  getDefaultHeroSlides,
  getDefaultPublishedHero,
  type DefaultGalleryImage,
  type DefaultVideo,
  type DefaultHeroSlide,
} from '@/lib/default-content';

export async function publicImageExists(imagePath: string): Promise<boolean> {
  if (!imagePath?.startsWith('/') || imagePath.includes('..')) return false;

  let filePath: string;
  if (imagePath.startsWith('/uploads/')) {
    const resolved = resolveUploadFilePath(imagePath);
    if (!resolved) return false;
    filePath = resolved;
  } else {
    filePath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''));
  }

  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveImagePath(imagePath: string, fallbackIndex: number): Promise<string> {
  if (await publicImageExists(imagePath)) return imagePath;
  const defaults = getDefaultGalleryImages();
  return defaults[fallbackIndex % defaults.length].imagePath;
}

export async function resolveHeroSlides<T extends { imagePath: string; altText: string }>(
  slides: T[],
  heroSectionId = ''
): Promise<(T | DefaultHeroSlide)[]> {
  if (slides.length === 0) return getDefaultHeroSlides(heroSectionId);

  const resolved = await Promise.all(
    slides.map(async (slide, i) => {
      if (await publicImageExists(slide.imagePath)) return slide;
      const fallback = getDefaultHeroSlideAt(i);
      return {
        ...slide,
        imagePath: fallback.imagePath,
        altText: slide.altText || fallback.altText,
      };
    })
  );

  return resolved;
}

function getDefaultHeroSlideAt(index: number) {
  const slides = getDefaultHeroSlides();
  return slides[index % slides.length];
}

export async function resolveLogoPath(logoPath: string | null | undefined): Promise<string> {
  const candidate = logoPath ?? DEFAULT_LOGO_PATH;
  if (await publicImageExists(candidate)) return candidate;
  return DEFAULT_LOGO_PATH;
}

type HeroSectionRecord = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  typewriterWords: unknown;
  logoPath: string | null;
  slides: { id: string; imagePath: string; altText: string; sortOrder: number; isDraft: boolean; heroSectionId: string; createdAt: Date }[];
};

export async function resolvePublishedHero(hero: HeroSectionRecord | null) {
  if (!hero) return getDefaultPublishedHero();

  const publishedSlides = hero.slides.filter((s) => !s.isDraft);
  const slides = await resolveHeroSlides(publishedSlides, hero.id);
  const logoPath = await resolveLogoPath(hero.logoPath);

  return {
    title: hero.title || DEFAULT_HERO_META.title,
    subtitle: hero.subtitle,
    description: hero.description,
    ctaText: hero.ctaText,
    ctaUrl: hero.ctaUrl,
    typewriterWords:
      (Array.isArray(hero.typewriterWords) && hero.typewriterWords.length > 0
        ? (hero.typewriterWords as string[])
        : DEFAULT_TYPEWRITER_WORDS),
    logoPath,
    slides,
  };
}

export async function resolveGalleryImages(
  images: DefaultGalleryImage[]
): Promise<DefaultGalleryImage[]> {
  if (images.length === 0) return getDefaultGalleryImages();

  const defaults = getDefaultGalleryImages();
  return Promise.all(
    images.map(async (img, i) => {
      const imagePath = await resolveImagePath(img.imagePath, i);
      if (imagePath === img.imagePath) return img;
      const fallback = defaults[i % defaults.length];
      return {
        ...img,
        imagePath,
        altText: img.altText || fallback.altText,
      };
    })
  );
}

export async function resolveVideos(videos: DefaultVideo[]): Promise<DefaultVideo[]> {
  if (videos.length === 0) return getDefaultVideos();
  return videos;
}

export async function resolveFeaturedGalleryImages(
  images: DefaultGalleryImage[]
): Promise<DefaultGalleryImage[]> {
  const resolved = await resolveGalleryImages(images);
  const featured = resolved.filter((img) => img.featured);
  if (featured.length > 0) return featured;
  return getDefaultGalleryImages().filter((img) => img.featured);
}
