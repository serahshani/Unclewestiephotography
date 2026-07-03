import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import GalleryViewTracker from '@/components/GalleryViewTracker';
import PublicLayout from '@/components/layout/PublicLayout';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  imageObjectSchema,
  webPageSchema,
} from '@/lib/seo/schemas';
import {
  getGalleryImageBySlug,
  getRelatedGalleryImages,
  getAllGallerySlugs,
} from '@/lib/data';
import { getSiteUrl } from '@/lib/api-utils';
import { portfolioDetailBreadcrumbs } from '@/lib/page-breadcrumbs';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllGallerySlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const image = await getGalleryImageBySlug(slug);
  if (!image) {
    return createPageMetadata({
      title: 'Photo Not Found',
      path: `/portfolio/${slug}`,
      noIndex: true,
    });
  }

  const description =
    image.description ??
    `View ${image.title} – photography by Uncle Westiee Studios in Kenya.`;

  return createPageMetadata({
    title: image.title,
    description,
    path: `/portfolio/${slug}`,
    keywords: `${image.title}, ${image.category ?? 'photography'} Kenya, Uncle Westiee Studios`,
    image: image.imagePath,
    ogType: 'article',
  });
}

export default async function GalleryDetailPage({ params }: Props) {
  const { slug } = await params;
  const image = await getGalleryImageBySlug(slug);
  if (!image) notFound();

  const related = await getRelatedGalleryImages(image.category, image.id);
  const siteUrl = getSiteUrl();
  const description =
    image.description ??
    `Photography by Uncle Westiee Studios – ${image.title}`;

  const breadcrumbs = portfolioDetailBreadcrumbs(image.title, slug);

  return (
    <PublicLayout>
      {!image.id.startsWith('default-gallery-') && (
        <GalleryViewTracker imageId={image.id} />
      )}
      <JsonLd
        data={[
          webPageSchema(siteUrl, `/portfolio/${slug}`, image.title, description),
          breadcrumbSchema(siteUrl, breadcrumbs),
          imageObjectSchema(siteUrl, {
            title: image.title,
            description: image.description,
            imagePath: image.imagePath,
            altText: image.altText,
            slug: image.slug,
          }),
        ]}
      />

      <main className="bg-white">
        <div className="mx-auto max-w-[90rem] px-4 pb-16 pt-28 sm:px-6 lg:pb-20">
          <Breadcrumbs items={breadcrumbs} variant="dark" />

          <article className="mt-8">
            <header className="mb-8 max-w-3xl">
              {image.category && (
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 capitalize">
                  {image.category}
                </p>
              )}
              <h1 className="mt-2 font-serif text-3xl font-medium text-[#012D26] sm:text-4xl md:text-5xl">
                {image.title}
              </h1>
              {image.description && (
                <p className="mt-4 text-base leading-relaxed text-gray-600">
                  {image.description}
                </p>
              )}
            </header>

            <figure>
              <Image
                src={image.imagePath}
                alt={image.altText}
                width={0}
                height={0}
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="h-auto w-full"
                style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }}
              />
              {image.altText && image.altText !== image.title && (
                <figcaption className="border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
                  {image.altText}
                </figcaption>
              )}
            </figure>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/portfolio"
                className="inline-block rounded-lg border border-[#012D26] px-5 py-2.5 text-sm font-semibold text-[#012D26] transition-colors hover:bg-[#012D26] hover:text-white"
              >
                Back to portfolio
              </Link>
              <Link
                href="/contact"
                className="inline-block rounded-lg bg-[#012D26] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#014a3d]"
              >
                Book a session
              </Link>
            </div>

            {related.length > 0 && (
              <section className="mt-16 border-t border-gray-200 pt-12" aria-labelledby="related-heading">
                <h2 id="related-heading" className="font-serif text-2xl font-medium text-[#012D26]">
                  More from the portfolio
                </h2>
                <div className="mt-6 columns-2 gap-4 lg:columns-4">
                  {related.map((item) => (
                    <Link
                      key={item.id}
                      href={`/portfolio/${item.slug}`}
                      className="group mb-4 block break-inside-avoid overflow-hidden"
                    >
                      <Image
                        src={item.imagePath}
                        alt={item.altText}
                        width={0}
                        height={0}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                        style={{ width: '100%', height: 'auto' }}
                      />
                      <span className="mt-2 block text-sm font-medium text-gray-800 line-clamp-1">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </main>
    </PublicLayout>
  );
}
