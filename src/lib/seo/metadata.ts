import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/api-utils';
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT,
  SOCIAL,
  DEFAULT_OG_IMAGE,
} from '@/lib/site-config';

type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  ogType?: 'website' | 'article';
};

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
  keywords,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  ogType = 'website',
}: PageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: 'en_US',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} – Kenya Photography & Videography`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords:
    'Uncle Westiee Studios, Photography Kenya, Wedding Videographer, Best Photographer in Kenya, Event Coverage Kenya',
  alternates: { canonical: getSiteUrl() },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: `${SITE_NAME} – Photography & Videography`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} – Photography & Videography`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: { icon: '/Westieelogo.png', apple: '/Westieelogo.png' },
};

export { SITE_NAME, SITE_DESCRIPTION, CONTACT, SOCIAL };
