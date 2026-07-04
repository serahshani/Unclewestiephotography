import { CONTACT, SOCIAL } from '@/lib/site-config';

function escapeJsonLd(value: string): string {
  return value.replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

export function organizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    name: 'Uncle Westiee Studios',
    url: siteUrl,
    logo: `${siteUrl}/Westieelogo.png`,
    image: `${siteUrl}/Westieelogo.png`,
    description:
      'Wedding, portrait, and event photography and videography in Nairobi, Samburu, Maralal, and across Kenya. Uncle Westiee Studios captures candid moments and timeless portraits.',
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      addressCountry: 'KE',
    },
    areaServed: [
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'City', name: 'Nairobi' },
      { '@type': 'AdministrativeArea', name: 'Samburu' },
      { '@type': 'City', name: 'Maralal' },
    ],
    knowsAbout: [
      'Wedding photography',
      'Portrait photography',
      'Event photography',
      'Wedding videography',
      'Family photography',
      'Fashion photography',
    ],
    sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.youtube, SOCIAL.tiktok],
  };
}

export function websiteSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Uncle Westiee Studios',
    url: siteUrl,
  };
}

export function webPageSchema(
  siteUrl: string,
  path: string,
  title: string,
  description: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: escapeJsonLd(title),
    description: escapeJsonLd(description),
    url: `${siteUrl}${path}`,
    isPartOf: { '@type': 'WebSite', url: siteUrl },
  };
}

export function breadcrumbSchema(
  siteUrl: string,
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: escapeJsonLd(item.name),
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function imageObjectSchema(
  siteUrl: string,
  image: {
    title: string;
    description?: string | null;
    imagePath: string;
    altText: string;
    slug?: string;
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: escapeJsonLd(image.title),
    description: image.description ? escapeJsonLd(image.description) : undefined,
    contentUrl: `${siteUrl}${image.imagePath}`,
    caption: escapeJsonLd(image.altText),
    url: image.slug ? `${siteUrl}/portfolio/${image.slug}` : undefined,
  };
}

export function videoObjectSchema(
  siteUrl: string,
  video: {
    title: string;
    description?: string | null;
    sourceType?: 'youtube' | 'upload';
    youtubeId?: string | null;
    videoPath?: string | null;
    createdAt?: Date;
  }
) {
  const isUpload = video.sourceType === 'upload' && video.videoPath;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: escapeJsonLd(video.title),
    description: video.description ? escapeJsonLd(video.description) : undefined,
    thumbnailUrl: isUpload
      ? undefined
      : `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
    embedUrl: isUpload
      ? undefined
      : `https://www.youtube.com/embed/${video.youtubeId}`,
    uploadDate: video.createdAt?.toISOString(),
    contentUrl: isUpload
      ? `${siteUrl}${video.videoPath}`
      : `https://www.youtube.com/watch?v=${video.youtubeId}`,
  };
}

export function localBusinessSchema(siteUrl: string) {
  return organizationSchema(siteUrl);
}

export function contactPageSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Uncle Westiee Studios',
    description:
      'Contact Uncle Westiee Studios for wedding, portrait, and event photography and videography bookings in Kenya.',
    url: `${siteUrl}/contact`,
    mainEntity: {
      '@type': 'ContactPoint',
      telephone: CONTACT.phone,
      email: CONTACT.email,
      contactType: 'customer service',
      areaServed: 'KE',
      availableLanguage: ['English', 'Swahili'],
    },
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: escapeJsonLd(item.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: escapeJsonLd(item.answer),
      },
    })),
  };
}

export function offerCatalogSchema(
  siteUrl: string,
  catalogName: string,
  packages: { id: string; name: string; description: string; category: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: escapeJsonLd(catalogName),
    url: `${siteUrl}/packages`,
    itemListElement: packages.map((pkg, index) => ({
      '@type': 'Offer',
      position: index + 1,
      name: escapeJsonLd(pkg.name),
      description: escapeJsonLd(pkg.description),
      category: escapeJsonLd(pkg.category),
      url: `${siteUrl}/packages#${pkg.id}`,
      availability: 'https://schema.org/InStock',
      areaServed: 'Kenya',
      seller: {
        '@type': 'LocalBusiness',
        name: 'Uncle Westiee Studios',
        url: siteUrl,
        telephone: CONTACT.phone,
      },
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'KES',
        description: 'Custom quote based on date, location, and coverage',
      },
    })),
  };
}

export function collectionPageSchema(
  siteUrl: string,
  path: string,
  title: string,
  description: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: escapeJsonLd(title),
    description: escapeJsonLd(description),
    url: `${siteUrl}${path}`,
    isPartOf: { '@type': 'WebSite', url: siteUrl },
  };
}

export function itemListSchema(
  siteUrl: string,
  name: string,
  items: { name: string; url: string; image?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: escapeJsonLd(name),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: escapeJsonLd(item.name),
      url: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
      ...(item.image
        ? {
            image: item.image.startsWith('http') ? item.image : `${siteUrl}${item.image}`,
          }
        : {}),
    })),
  };
}
