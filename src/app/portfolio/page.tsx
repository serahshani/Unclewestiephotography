import { sortByDisplayOrder } from '@/lib/sort-media';
import PortfolioClient, { MediaItem } from '@/components/PortfolioClient';
import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import { getGalleryImages, getVideos } from '@/lib/data';
import { getSiteUrl } from '@/lib/api-utils';
import {
  breadcrumbSchema,
  imageObjectSchema,
  videoObjectSchema,
  webPageSchema,
} from '@/lib/seo/schemas';
import { createPageMetadata } from '@/lib/seo/metadata';
import { PORTFOLIO_BREADCRUMBS } from '@/lib/page-breadcrumbs';

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: 'Portfolio',
  description:
    'Explore our curated collection of photography and videography work – weddings, events, portraits, and landscapes across Kenya.',
  path: '/portfolio',
  keywords:
    'photography portfolio Kenya, wedding photos, event coverage, Uncle Westiee Studios gallery',
});

function buildPortfolioData(
  images: Awaited<ReturnType<typeof getGalleryImages>>,
  videos: Awaited<ReturnType<typeof getVideos>>
) {
  const imageMedia: MediaItem[] = images.map((img) => ({
    type: 'image' as const,
    src: img.imagePath,
    alt: img.altText,
    slug: img.slug,
    category: img.category ?? undefined,
    sortOrder: img.sortOrder,
    createdAt: img.createdAt.getTime(),
  }));

  const videoMedia: MediaItem[] = videos.map((v) => ({
    type: 'video' as const,
    videoSource: (v.sourceType === 'upload' ? 'upload' : 'youtube') as 'youtube' | 'upload',
    videoId: v.youtubeId ?? undefined,
    src: v.sourceType === 'upload' ? v.videoPath ?? undefined : undefined,
    title: v.title,
    description: v.description ?? undefined,
    category: v.category ?? undefined,
    sortOrder: v.sortOrder,
    createdAt: v.createdAt.getTime(),
  }));

  const allMedia = sortByDisplayOrder([...imageMedia, ...videoMedia]);

  const categorySet = new Set<string>();
  images.forEach((i) => i.category && categorySet.add(i.category));
  videos.forEach((v) => v.category && categorySet.add(v.category));

  const categories = [
    { id: 'all', name: 'All Media' },
    ...Array.from(categorySet).map((c) => ({
      id: c,
      name: c.charAt(0).toUpperCase() + c.slice(1),
    })),
  ];

  const mediaByCategory: Record<string, MediaItem[]> = { all: allMedia };
  categorySet.forEach((cat) => {
    mediaByCategory[cat] = allMedia.filter((m) => m.category === cat);
  });

  return { categories, allMedia, mediaByCategory, images, videos };
}

export default async function PortfolioPage() {
  const [images, videos] = await Promise.all([
    getGalleryImages(),
    getVideos(),
  ]);

  const { categories, allMedia, mediaByCategory, images: galleryImages, videos: videoList } =
    buildPortfolioData(images, videos);
  const siteUrl = getSiteUrl();

  const breadcrumbs = PORTFOLIO_BREADCRUMBS;

  return (
    <PublicLayout>
      <JsonLd
        data={[
          webPageSchema(
            siteUrl,
            '/portfolio',
            'Portfolio',
            'Our visual journey – photography and videography portfolio'
          ),
          breadcrumbSchema(siteUrl, breadcrumbs),
          ...galleryImages.slice(0, 10).map((img) =>
            imageObjectSchema(siteUrl, {
              title: img.title,
              description: img.description,
              imagePath: img.imagePath,
              altText: img.altText,
              slug: img.slug,
            })
          ),
          ...videoList.slice(0, 10).map((v) =>
            videoObjectSchema(siteUrl, {
              title: v.title,
              description: v.description,
              sourceType: v.sourceType === 'upload' ? 'upload' : 'youtube',
              youtubeId: v.youtubeId,
              videoPath: v.videoPath,
              createdAt: v.createdAt,
            })
          ),
        ]}
      />
      <PortfolioClient
        categories={categories}
        allMedia={allMedia}
        mediaByCategory={mediaByCategory}
        breadcrumbs={breadcrumbs}
      />
    </PublicLayout>
  );
}
