import PublicLayout from '@/components/layout/PublicLayout';
import JsonLd from '@/components/seo/JsonLd';
import { createPageMetadata } from '@/lib/seo/metadata';
import { CONTACT_FAQ_ITEMS } from '@/lib/contact-faq';
import { breadcrumbSchema, contactPageSchema, faqPageSchema, webPageSchema } from '@/lib/seo/schemas';
import { getSiteUrl } from '@/lib/api-utils';
import { CONTACT_BREADCRUMBS } from '@/lib/page-breadcrumbs';
import { SITE_NAME } from '@/lib/site-config';

export const metadata = createPageMetadata({
  title: 'Contact Uncle Westiee Studios',
  description:
    'Book wedding, portrait, and event photography with Uncle Westiee Studios in Kenya. FAQs on booking lead times, travel, and packages—plus call, email, WhatsApp, or send a message.',
  path: '/contact',
  keywords:
    'contact photographer Kenya, book Uncle Westiee Studios, wedding photographer Nairobi, videography Kenya, photography booking FAQ Kenya, travel photographer Kenya',
  image: '/Hero3.webp',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = getSiteUrl();
  const breadcrumbs = CONTACT_BREADCRUMBS;

  return (
    <PublicLayout>
      <JsonLd
        data={[
          contactPageSchema(siteUrl),
          webPageSchema(
            siteUrl,
            '/contact',
            `Contact ${SITE_NAME}`,
            'Contact Uncle Westiee Studios for photography and videography bookings in Kenya.'
          ),
          breadcrumbSchema(siteUrl, breadcrumbs),
          faqPageSchema(CONTACT_FAQ_ITEMS),
        ]}
      />
      {children}
    </PublicLayout>
  );
}
