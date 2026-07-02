import { sortByDisplayOrder } from '@/lib/sort-media';
import PortfolioClient, { MediaItem } from '@/components/PortfolioClient';
import PageHero from '@/components/layout/PageHero';
import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import { getGalleryImages, getVideos } from '@/lib/data';
import { getSiteUrl } from '@/lib/api-utils';
import {
  breadcrumbSchema,
  collectionPageSchema,
  imageObjectSchema,
  itemListSchema,
  videoObjectSchema,
  webPageSchema,
} from '@/lib/seo/schemas';
import { createPageMetadata } from '@/lib/seo/metadata';
import { PORTFOLIO_BREADCRUMBS } from '@/lib/page-breadcrumbs';
import { SITE_NAME } from '@/lib/site-config';

export const revalidate = 60;

const PAGE_TITLE = 'Photography & Videography Portfolio';
const PAGE_DESCRIPTION =
  'Browse wedding, event, portrait, and landscape photography and videography by Uncle Westiee Studios in Kenya. Nairobi, Samburu, Maralal, and nationwide.';

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/portfolio',
  keywords:
    'photography portfolio Kenya, wedding photos Nairobi, event videography Kenya, portrait gallery, Uncle Westiee Studios portfolio, Samburu wedding photography',
  image: '/Gallery6.jpg',
});

function buildPortfolioData(
  images: Awaited<ReturnType<typeof getGalleryImages>>,
  videos: Awaited<ReturnType<typeof getVideos>>
) {
  const imageMedia: MediaItem[] = images.map((img) => ({
    type: 'image' as const,
    src: img.imagePath,
    alt: img.altText,
    title: img.title,
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
    { id: 'all', name: 'All' },
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
  const [images, videos] = await Promise.all([getGalleryImages(), getVideos()]);

  const { categories, allMedia, mediaByCategory, images: galleryImages, videos: videoList } =
    buildPortfolioData(images, videos);
  const siteUrl = getSiteUrl();
  const breadcrumbs = PORTFOLIO_BREADCRUMBS;

  const portfolioListItems = [
    ...galleryImages.map((img) => ({
      name: img.title,
      url: `/portfolio/${img.slug}`,
      image: img.imagePath,
    })),
    ...videoList.slice(0, 10).map((video) => ({
      name: video.title,
      url: video.youtubeId
        ? `https://www.youtube.com/watch?v=${video.youtubeId}`
        : '/portfolio',
      image: video.youtubeId
        ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
        : video.videoPath ?? undefined,
    })),
  ].slice(0, 20);

  return (
    <PublicLayout>
      <JsonLd
        data={[
          collectionPageSchema(siteUrl, '/portfolio', PAGE_TITLE, PAGE_DESCRIPTION),
          webPageSchema(
            siteUrl,
            '/portfolio',
            `${PAGE_TITLE} | ${SITE_NAME}`,
            PAGE_DESCRIPTION
          ),
          breadcrumbSchema(siteUrl, breadcrumbs),
          itemListSchema(siteUrl, `${SITE_NAME} Portfolio`, portfolioListItems),
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
      <PageHero
        image="/Gallery6.jpg"
        imageAlt="Photography and videography portfolio by Uncle Westiee Studios in Kenya"
        title="Photography & Videography Portfolio"
        subtitle="Wedding, event, portrait, and landscape work by Uncle Westiee Studios — Nairobi, Samburu, and across Kenya."
        breadcrumbs={breadcrumbs}
        heightClass="h-80 sm:h-96"
        imagePosition="object-[center_30%]"
        imageBrightness="brightness-50"
        priority
      />
      <PortfolioClient
        categories={categories}
        allMedia={allMedia}
        mediaByCategory={mediaByCategory}
      />
    </PublicLayout>
  );
}
