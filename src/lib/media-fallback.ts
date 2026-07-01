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

export async function resolveLogoPath(logoPath: string | null | undefined): Promise<string | null> {
  if (logoPath?.startsWith('/uploads/') && isSafeUploadImagePath(logoPath)) {
    if (await publicImageExists(logoPath)) return logoPath;
    return null;
  }
  if (logoPath && (await publicImageExists(logoPath))) return logoPath;
  if (await publicImageExists(DEFAULT_LOGO_PATH)) return DEFAULT_LOGO_PATH;
  return null;
}

function isSafeUploadImagePath(imagePath: string): boolean {
  return /^\/uploads\/(hero|gallery)\/[a-zA-Z0-9._-]+\.webp$/.test(imagePath);
}

type HeroSlideRecord = {
  id: string;
  imagePath: string;
  altText: string;
  sortOrder: number;
  isDraft: boolean;
  heroSectionId: string;
  createdAt: Date;
};

type HeroSectionRecord = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  typewriterWords: unknown;
  logoPath: string | null;
  draftTitle?: string | null;
  draftSubtitle?: string | null;
  draftDescription?: string | null;
  draftCtaText?: string | null;
  draftCtaUrl?: string | null;
  draftTypewriterWords?: unknown;
  draftLogoPath?: string | null;
  slides: HeroSlideRecord[];
};

function pickTypewriterWords(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.length > 0 ? (value as string[]) : fallback;
}

function formatHeroSlides(slides: (HeroSlideRecord | DefaultHeroSlide)[]) {
  return slides.map((slide) => ({
    id: slide.id,
    imagePath: slide.imagePath,
    altText: slide.altText,
    sortOrder: slide.sortOrder,
    isDraft: 'isDraft' in slide ? slide.isDraft : false,
  }));
}

export async function resolvePublishedHero(hero: HeroSectionRecord | null) {
  if (!hero) return getDefaultPublishedHero();

  const publishedSlides = hero.slides.filter((s) => !s.isDraft);
  const slides = await resolveHeroSlides(publishedSlides, hero.id);
  const logoPath = await resolveLogoPath(hero.logoPath);

  return {
    title: hero.title || DEFAULT_HERO_META.title,
    subtitle: hero.subtitle ?? DEFAULT_HERO_META.subtitle,
    description: hero.description ?? DEFAULT_HERO_META.description,
    ctaText: hero.ctaText ?? DEFAULT_HERO_META.ctaText,
    ctaUrl: hero.ctaUrl ?? DEFAULT_HERO_META.ctaUrl,
    typewriterWords: pickTypewriterWords(hero.typewriterWords, [...DEFAULT_TYPEWRITER_WORDS]),
    logoPath,
    slides,
  };
}

export async function resolveDraftHero(hero: HeroSectionRecord) {
  const published = await resolvePublishedHero(hero);
  const logoPath = await resolveLogoPath(hero.draftLogoPath ?? hero.logoPath);

  let slides: (HeroSlideRecord | DefaultHeroSlide)[];
  if (hero.slides.length > 0) {
    const resolved = await resolveHeroSlides(hero.slides, hero.id);
    slides = hero.slides.map((slide, index) => ({
      ...slide,
      imagePath: resolved[index]?.imagePath ?? slide.imagePath,
      altText: resolved[index]?.altText ?? slide.altText,
    }));
  } else {
    slides = published.slides;
  }

  return {
    title: hero.draftTitle || published.title,
    subtitle: hero.draftSubtitle ?? hero.subtitle ?? published.subtitle,
    description: hero.draftDescription ?? hero.description ?? published.description,
    ctaText: hero.draftCtaText ?? hero.ctaText ?? published.ctaText,
    ctaUrl: hero.draftCtaUrl ?? hero.ctaUrl ?? published.ctaUrl,
    typewriterWords: pickTypewriterWords(
      hero.draftTypewriterWords ?? hero.typewriterWords,
      published.typewriterWords
    ),
    logoPath,
    slides: formatHeroSlides(slides),
    published: {
      title: published.title,
      subtitle: published.subtitle,
      description: published.description,
      ctaText: published.ctaText,
      ctaUrl: published.ctaUrl,
      typewriterWords: published.typewriterWords,
      logoPath: published.logoPath,
      slides: formatHeroSlides(published.slides),
    },
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
