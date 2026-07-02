import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import { createPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schemas';
import { getSiteUrl } from '@/lib/api-utils';
import { ABOUT_BREADCRUMBS } from '@/lib/page-breadcrumbs';

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
  const breadcrumbs = ABOUT_BREADCRUMBS;

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
      {children}
    </PublicLayout>
  );
}
