import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { createPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schemas';
import { getSiteUrl } from '@/lib/api-utils';

export const metadata = createPageMetadata({
  title: 'Packages',
  description:
    'Affordable photography and videography packages for weddings, events, and portraits by Uncle Westiee Studios.',
  path: '/packages',
  keywords: 'photography packages Kenya, wedding package prices',
});

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = getSiteUrl();
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
  ];

  return (
    <PublicLayout>
      <JsonLd
        data={[
          webPageSchema(siteUrl, '/packages', 'Packages', 'Photography and videography packages'),
          breadcrumbSchema(siteUrl, breadcrumbs),
        ]}
      />
      <div className="container mx-auto px-6 pt-28">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      {children}
    </PublicLayout>
  );
}
