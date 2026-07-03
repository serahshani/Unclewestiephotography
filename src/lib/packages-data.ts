export type StudioPackage = {
  id: string;
  name: string;
  category: string;
  features: string[];
  idealFor: string;
  buttonText: string;
  whatsappMessage: string;
  price?: string;
};

export const STUDIO_PACKAGES: StudioPackage[] = [
  {
    id: 'portrait',
    name: 'Essential Portrait',
    category: 'Portraits',
    features: [
      '1-hour photo session',
      '1 location (studio or outdoor)',
      '2 outfit changes',
      '20 high-resolution edited photos',
      'Online gallery for 1 month',
    ],
    idealFor: 'Individuals, professional headshots, simple family portraits.',
    buttonText: 'Inquire Essential',
    whatsappMessage: 'Hello! I would like to inquire about the Essential Portrait package.',
  },
  {
    id: 'events',
    name: 'Premium Event',
    category: 'Events',
    features: [
      '4 hours of coverage',
      '2 photographers',
      '150 high-resolution edited photos',
      'Online gallery for 3 months',
      'Basic video highlights (3-5 min)',
    ],
    idealFor: 'Birthday parties, anniversaries, corporate gatherings.',
    buttonText: 'Inquire Premium',
    whatsappMessage: 'Hello! I would like to Inquire about the Premium Event package.',
  },
  {
    id: 'wedding',
    name: 'Luxury Wedding',
    category: 'Wedding',
    features: [
      'Full-day coverage (up to 10 hours)',
      '2 lead photographers',
      '400+ high-resolution edited photos',
      'Custom engraved wooden USB drive',
      'Elegant wedding album',
      'Cinematic wedding video (20-30 min)',
    ],
    idealFor: 'Couples seeking comprehensive, premium wedding coverage.',
    buttonText: 'Inquire Luxury',
    whatsappMessage: 'Hello! I would like to Inquire about the Luxury Wedding package.',
  },
  {
    id: 'commercial',
    name: 'Commercial Starter',
    category: 'Commercial',
    price: 'Custom Quote',
    features: [
      'Half-day shoot (up to 4 hours)',
      'Product/Service focused imagery',
      '50 high-resolution commercial-use images',
      'Basic usage license',
    ],
    idealFor: 'Small businesses, e-commerce product listings, brand content.',
    buttonText: 'Request Quote',
    whatsappMessage: 'Hello! I would like to inquire about the Commercial Starter package.',
  },
];

export function packageSchemaDescription(pkg: StudioPackage): string {
  return `${pkg.idealFor} Includes: ${pkg.features.join('; ')}.`;
}
