import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import { createPageMetadata } from '@/lib/seo/metadata';
import { packageSchemaDescription, STUDIO_PACKAGES } from '@/lib/packages-data';
import { PACKAGES_FAQ_ITEMS } from '@/lib/packages-faq';
import { breadcrumbSchema, faqPageSchema, offerCatalogSchema, webPageSchema } from '@/lib/seo/schemas';
import { getSiteUrl } from '@/lib/api-utils';
import { PACKAGES_BREADCRUMBS } from '@/lib/page-breadcrumbs';
import { SITE_NAME } from '@/lib/site-config';

const PAGE_TITLE = 'Photography & Videography Packages';
const PAGE_DESCRIPTION =
  'Wedding, event, portrait, and commercial photography and videography packages from Uncle Westiee Studios in Kenya. Nairobi-based, serving Samburu, Maralal, and nationwide. Request a quote on WhatsApp.';

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/packages',
  keywords:
    'photography packages Kenya, wedding photography package Nairobi, event photographer Kenya, portrait session Kenya, videography packages Kenya, Uncle Westiee Studios packages, Samburu wedding photographer',
  image: '/Packages.jpg',
});

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = getSiteUrl();
  const breadcrumbs = PACKAGES_BREADCRUMBS;

  return (
    <PublicLayout>
      <JsonLd
        data={[
          webPageSchema(siteUrl, '/packages', `${PAGE_TITLE} | ${SITE_NAME}`, PAGE_DESCRIPTION),
          breadcrumbSchema(siteUrl, breadcrumbs),
          offerCatalogSchema(
            siteUrl,
            `${SITE_NAME} Photography Packages`,
            STUDIO_PACKAGES.map((pkg) => ({
              id: pkg.id,
              name: pkg.name,
              description: packageSchemaDescription(pkg),
              category: pkg.category,
            }))
          ),
          faqPageSchema(PACKAGES_FAQ_ITEMS),
        ]}
      />
      {children}
    </PublicLayout>
  );
}
