import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { createPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, localBusinessSchema, webPageSchema } from '@/lib/seo/schemas';
import { getSiteUrl } from '@/lib/api-utils';

export const metadata = createPageMetadata({
  title: 'Contact',
  description:
    'Get in touch with Uncle Westiee Studios for photography and videography bookings in Kenya.',
  path: '/contact',
  keywords: 'contact photographer Kenya, book Uncle Westiee Studios',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = getSiteUrl();
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <PublicLayout>
      <JsonLd
        data={[
          localBusinessSchema(siteUrl),
          webPageSchema(siteUrl, '/contact', 'Contact', 'Contact Uncle Westiee Studios'),
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
