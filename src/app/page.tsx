import type { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import PortfolioCarousel from '@/app/Components/PortfolioCarousel';
import AboutPage from './Pages/about';
import Packages from './Pages/packages';
import ServicesHero from './Pages/ServicesHero';
import ServicesPage from './Pages/services';
import HomeHero from '@/components/HomeHero';
import JsonLd from '@/components/seo/JsonLd';
import { getPublishedHero, getGalleryImages } from '@/lib/data';
import { getSiteUrl } from '@/lib/api-utils';
import {
  itemListSchema,
  organizationSchema,
  websiteSchema,
  webPageSchema,
} from '@/lib/seo/schemas';
import { createPageMetadata } from '@/lib/seo/metadata';
import { SITE_NAME } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

const PAGE_TITLE = 'Wedding & Portrait Photography in Kenya';
const PAGE_DESCRIPTION =
  'Uncle Westiee Studios — wedding, portrait, and event photography and videography in Nairobi, Samburu, Maralal, and across Kenya. View our portfolio and book your session on WhatsApp.';
const PAGE_KEYWORDS =
  'wedding photographer Kenya, wedding photography Nairobi, portrait photographer Kenya, event photographer Samburu, videography Kenya, family photoshoot Kenya, wedding videography Maralal, photographer Samburu, Uncle Westiee Studios, photography packages Kenya, best photographer Kenya';

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/',
  keywords: PAGE_KEYWORDS,
  image: '/Hero1.webp',
});

export default async function Home() {
  const [hero, featuredImages] = await Promise.all([
    getPublishedHero(),
    getGalleryImages({ featured: true }),
  ]);

  const siteUrl = getSiteUrl();
  const featuredListItems = featuredImages.slice(0, 10).map((img) => ({
    name: img.title,
    url: img.slug ? `/portfolio/${img.slug}` : '/portfolio',
    image: img.imagePath,
  }));

  return (
    <PublicLayout>
      <JsonLd
        data={[
          organizationSchema(siteUrl),
          websiteSchema(siteUrl),
          webPageSchema(
            siteUrl,
            '/',
            `${PAGE_TITLE} | ${SITE_NAME}`,
            PAGE_DESCRIPTION
          ),
          ...(featuredListItems.length > 0
            ? [itemListSchema(siteUrl, `${SITE_NAME} Featured Photography`, featuredListItems)]
            : []),
        ]}
      />
      <HomeHero
        slides={hero.slides.map((s) => ({
          id: s.id,
          imagePath: s.imagePath,
          altText: s.altText,
        }))}
        typewriterWords={hero.typewriterWords}
        logoPath={hero.logoPath}
        ctaText={hero.ctaText}
        ctaUrl={hero.ctaUrl}
        seoH1={PAGE_TITLE}
        seoSubtitle="Wedding, portrait & event photography · Nairobi · Samburu · Maralal · Kenya"
      />
      <ServicesPage />
      <AboutPage />
      <PortfolioCarousel
        images={featuredImages.map((img) => ({
          src: img.imagePath,
          alt: img.altText,
        }))}
      />
      <ServicesHero />
      <Packages />
    </PublicLayout>
  );
}
