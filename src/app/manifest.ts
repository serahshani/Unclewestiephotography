import { MetadataRoute } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-config';
import { getSiteUrl } from '@/lib/api-utils';

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: SITE_NAME,
    short_name: 'Westiee Studios',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#012D26',
    theme_color: '#012D26',
    orientation: 'portrait-primary',
    lang: 'en',
    icons: [
      {
        src: `${siteUrl}/Westieelogo.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
