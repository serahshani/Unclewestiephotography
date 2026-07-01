export const SITE_NAME = 'Uncle Westiee Studios';

export const SITE_DESCRIPTION =
  'Capture your beautiful memories with Uncle Westiee Studios – your trusted photography and videography partner in Kenya.';

export const CONTACT = {
  email: 'info@unclewestieestudios.co.ke',
  phone: '+254791264173',
  whatsapp: 'https://wa.me/+254791264173',
  location: 'Nairobi, Kenya',
} as const;

export const SOCIAL = {
  facebook: 'https://www.facebook.com/p/Uncle_westiee-photography-100076434076242/',
  instagram: 'https://www.instagram.com/uncle_westiee_studios/?hl=en',
  youtube: 'https://www.youtube.com/channel/UCaPJSHbeHHA5Wft0ywekl-A',
  tiktok: 'https://www.tiktok.com/@unclewestiee',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/packages', label: 'Packages' },
  { href: '/contact', label: 'Contact' },
] as const;

export const DEFAULT_OG_IMAGE = '/opengraph-image';
