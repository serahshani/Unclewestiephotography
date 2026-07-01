import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { createPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schemas';
import { getSiteUrl } from '@/lib/api-utils';

export const metadata = createPageMetadata({
  title: 'About Us',
  description:
    'Learn about Uncle Westiee Studios – our journey, philosophy, and passion for capturing moments and crafting memories in Kenya.',
  path: '/about',
  keywords: 'about Uncle Westiee Studios, photography team Kenya, studio philosophy',
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = getSiteUrl();
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  return (
    <PublicLayout>
      <JsonLd
        data={[
          webPageSchema(
            siteUrl,
            '/about',
            'About Us',
            'Our journey and philosophy as Kenya photography and videography specialists'
          ),
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
