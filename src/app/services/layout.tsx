import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import { createPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schemas';
import { getSiteUrl } from '@/lib/api-utils';
import { SERVICES_BREADCRUMBS } from '@/lib/page-breadcrumbs';

export const metadata = createPageMetadata({
  title: 'Services',
  description:
    'Professional photography and videography services – weddings, events, portraits, aerial, and commercial coverage in Kenya.',
  path: '/services',
  keywords: 'photography services Kenya, videography, wedding photographer',
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = getSiteUrl();
  const breadcrumbs = SERVICES_BREADCRUMBS;

  return (
    <PublicLayout>
      <JsonLd
        data={[
          webPageSchema(siteUrl, '/services', 'Services', 'Photography and videography services in Kenya'),
          breadcrumbSchema(siteUrl, breadcrumbs),
        ]}
      />
      {children}
    </PublicLayout>
  );
}
