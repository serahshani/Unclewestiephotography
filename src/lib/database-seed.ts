import bcrypt from 'bcryptjs';
import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
import {
  defaultGallerySource,
  defaultVideoSource,
  defaultHeroSlideSource,
  DEFAULT_HERO_META,
  DEFAULT_TYPEWRITER_WORDS,
} from '@/lib/default-content';

function slugFromTitle(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

export async function runDatabaseSeed(): Promise<void> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set before seeding');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: { username: adminUsername, passwordHash },
  });

  let hero = await prisma.heroSection.findFirst();
  if (!hero) {
    hero = await prisma.heroSection.create({
      data: {
        title: DEFAULT_HERO_META.title,
        subtitle: DEFAULT_HERO_META.subtitle,
        description: DEFAULT_HERO_META.description,
        ctaText: DEFAULT_HERO_META.ctaText,
        ctaUrl: DEFAULT_HERO_META.ctaUrl,
        typewriterWords: DEFAULT_TYPEWRITER_WORDS,
        logoPath: DEFAULT_HERO_META.logoPath,
        draftTitle: DEFAULT_HERO_META.title,
        draftSubtitle: DEFAULT_HERO_META.subtitle,
        draftDescription: DEFAULT_HERO_META.description,
        draftCtaText: DEFAULT_HERO_META.ctaText,
        draftCtaUrl: DEFAULT_HERO_META.ctaUrl,
        draftTypewriterWords: DEFAULT_TYPEWRITER_WORDS,
        draftLogoPath: DEFAULT_HERO_META.logoPath,
      },
    });

    for (const slide of defaultHeroSlideSource) {
      await prisma.heroSlide.create({
        data: { heroSectionId: hero.id, ...slide, isDraft: false },
      });
    }
  }

  for (let i = 0; i < defaultGallerySource.length; i++) {
    const img = defaultGallerySource[i];
    const slug = slugFromTitle(img.title);
    await prisma.galleryImage.upsert({
      where: { slug },
      update: {
        title: img.title,
        imagePath: img.imagePath,
        altText: img.altText,
        category: img.category,
        featured: img.featured ?? false,
        sortOrder: i,
      },
      create: {
        title: img.title,
        imagePath: img.imagePath,
        altText: img.altText,
        slug,
        category: img.category,
        featured: img.featured ?? false,
        sortOrder: i,
      },
    });
  }

  for (let i = 0; i < defaultVideoSource.length; i++) {
    const video = defaultVideoSource[i];
    const existing = await prisma.video.findFirst({
      where: { youtubeId: video.youtubeId },
    });
    if (!existing) {
      await prisma.video.create({
        data: {
          title: video.title,
          description: video.description,
          youtubeUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
          youtubeId: video.youtubeId,
          category: video.category,
          sortOrder: i,
        },
      });
    }
  }

  await prisma.websiteSetting.upsert({
    where: { key: 'site_name' },
    update: { value: 'Uncle Westiee Studios' },
    create: { key: 'site_name', value: 'Uncle Westiee Studios' },
  });
}
