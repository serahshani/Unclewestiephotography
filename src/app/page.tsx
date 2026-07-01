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
import { organizationSchema, websiteSchema, webPageSchema } from '@/lib/seo/schemas';
import { createPageMetadata } from '@/lib/seo/metadata';

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: 'Kenya Photography & Videography',
  description:
    'Uncle Westiee Studios – professional wedding, event, and portrait photography and videography in Kenya. View our portfolio and book your session.',
  path: '/',
  keywords:
    'photography Kenya, videography Nairobi, wedding photographer Kenya, Uncle Westiee Studios',
  image: '/Hero1.webp',
});

export default async function Home() {
  const [hero, featuredImages] = await Promise.all([
    getPublishedHero(),
    getGalleryImages({ featured: true }),
  ]);

  const siteUrl = getSiteUrl();
  const heroTitle = hero.typewriterWords.join(' ') || 'Uncle Westiee Studios';

  return (
    <PublicLayout>
      <JsonLd
        data={[
          organizationSchema(siteUrl),
          websiteSchema(siteUrl),
          webPageSchema(
            siteUrl,
            '/',
            heroTitle,
            'Professional photography and videography services in Kenya'
          ),
        ]}
      />
      <HomeHero
        slides={hero.slides.map((s) => ({
          id: s.id,
          imagePath: s.imagePath,
          altText: s.altText,
        }))}
        typewriterWords={hero.typewriterWords}
        logoPath={hero.logoPath ?? '/Hero4.png'}
        ctaText={hero.ctaText}
        ctaUrl={hero.ctaUrl}
        seoTitle={heroTitle}
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
