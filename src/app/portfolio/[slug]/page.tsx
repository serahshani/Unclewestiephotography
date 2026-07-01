import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: image.title, path: `/portfolio/${slug}` },
  ];

  return (
    <PublicLayout>
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
      <article className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-4xl md:text-5xl font-bold text-[#012D26] mb-4">
          {image.title}
        </h1>
        {image.category && (
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-6 capitalize">
            {image.category}
          </p>
        )}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl mb-8">
          <Image
            src={image.imagePath}
            alt={image.altText}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
        {image.description && (
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            {image.description}
          </p>
        )}
        <Link
          href="/portfolio"
          className="inline-block bg-[#012D26] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors"
        >
          Back to Portfolio
        </Link>

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-bold text-[#012D26] mb-6">
              Related Work
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className="group relative aspect-square rounded-lg overflow-hidden shadow-md"
                >
                  <Image
                    src={item.imagePath}
                    alt={item.altText}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-sm p-2 truncate">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </PublicLayout>
  );
}
