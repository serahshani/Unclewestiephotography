import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import { createPageMetadata } from '@/lib/seo/metadata';
import { FEATURED_SERVICES, SUPPORTING_SERVICES } from '@/lib/services-data';
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/seo/schemas';
import { getSiteUrl } from '@/lib/api-utils';
import { SERVICES_BREADCRUMBS } from '@/lib/page-breadcrumbs';
import { SITE_NAME } from '@/lib/site-config';

const PAGE_TITLE = 'Photography & Videography Services';
const PAGE_DESCRIPTION =
  'Wedding, portrait, event, commercial, drone, and videography services from Uncle Westiee Studios in Kenya. Nairobi-based, serving Samburu, Maralal, and nationwide.';

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/services',
  keywords:
    'photography services Kenya, wedding photographer Nairobi, portrait photography Kenya, event videography Kenya, drone photography Kenya, commercial photography Kenya, Uncle Westiee Studios services, Samburu photographer',
  image: '/Servicespagehero.jpg',
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = getSiteUrl();
  const breadcrumbs = SERVICES_BREADCRUMBS;
  const serviceListItems = [
    ...FEATURED_SERVICES.map((service) => ({
      name: service.title,
      url: `/services#${service.id}`,
      image: service.image,
    })),
    ...SUPPORTING_SERVICES.map((service) => ({
      name: service.title,
      url: `/services#${service.id}`,
    })),
  ];

  return (
    <PublicLayout>
      <JsonLd
        data={[
          webPageSchema(
            siteUrl,
            '/services',
            `${PAGE_TITLE} | ${SITE_NAME}`,
            PAGE_DESCRIPTION
          ),
          breadcrumbSchema(siteUrl, breadcrumbs),
          itemListSchema(siteUrl, `${SITE_NAME} Photography Services`, serviceListItems),
        ]}
      />
      {children}
    </PublicLayout>
  );
}
