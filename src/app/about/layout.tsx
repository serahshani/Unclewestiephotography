import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import { createPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schemas';
import { getSiteUrl } from '@/lib/api-utils';
import { ABOUT_BREADCRUMBS } from '@/lib/page-breadcrumbs';
import { SITE_NAME } from '@/lib/site-config';

const PAGE_TITLE = 'About Uncle Westiee Studios';
const PAGE_DESCRIPTION =
  'Meet Uncle Westiee Studios — wedding, portrait, and event photographers and videographers in Kenya. Our story, values, and approach from Nairobi to Samburu and nationwide.';

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/about',
  keywords:
    'about Uncle Westiee Studios, wedding photographer Kenya, photography team Nairobi, videography studio Kenya, Samburu photographer, portrait photographer Kenya',
  image: '/Westiee-about.jpeg',
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
            `${PAGE_TITLE} | ${SITE_NAME}`,
            PAGE_DESCRIPTION
          ),
          breadcrumbSchema(siteUrl, breadcrumbs),
        ]}
      />
      {children}
    </PublicLayout>
  );
}
