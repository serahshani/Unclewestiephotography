import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/api-utils';
import { getAllGallerySlugs } from '@/lib/data';

export const revalidate = 3600;

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'];
}[] = [
  { path: '', priority: 1, changeFrequency: 'daily' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/portfolio', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/packages', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  let gallerySlugs: { slug: string; updatedAt: Date }[] = [];

  try {
    const { prisma } = await import('@/lib/prisma');
    gallerySlugs = await prisma.galleryImage.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
  } catch {
    gallerySlugs = [];
  }

  if (gallerySlugs.length === 0) {
    gallerySlugs = (await getAllGallerySlugs()).map(({ slug }) => ({
      slug,
      updatedAt: new Date(),
    }));
  }

  return [
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...gallerySlugs.map((img) => ({
      url: `${siteUrl}/portfolio/${img.slug}`,
      lastModified: img.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
