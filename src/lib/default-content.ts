import slugify from 'slugify';

export const DEFAULT_LOGO_PATH = '/Hero4.png';

export const DEFAULT_TYPEWRITER_WORDS = ['Uncle Westiee', 'Studios'];

export const DEFAULT_HERO_META = {
  title: 'Uncle Westiee Studios',
  subtitle: 'Photography & Videography in Kenya',
  description:
    'Capture your beautiful memories with Uncle Westiee Studios – your trusted photography and videography partner in Kenya.',
  ctaText: 'View Portfolio',
  ctaUrl: '/portfolio',
  typewriterWords: DEFAULT_TYPEWRITER_WORDS,
  logoPath: DEFAULT_LOGO_PATH,
} as const;

export const DEFAULT_HERO_SLIDES = [
  { imagePath: '/Hero1.webp', altText: 'Uncle Westiee Studios hero image 1', sortOrder: 0 },
  { imagePath: '/Hero2.webp', altText: 'Uncle Westiee Studios hero image 2', sortOrder: 1 },
  { imagePath: '/Hero3.webp', altText: 'Uncle Westiee Studios hero image 3', sortOrder: 2 },
] as const;

const GALLERY_SOURCE = [
  { title: 'Wedding Studios', imagePath: '/Hero1.png', altText: 'Wedding Studios', category: 'weddings', featured: true },
  { title: 'Portrait Session', imagePath: '/Gallery1.jpg', altText: 'Portrait Session', category: 'portraits', featured: true },
  { title: 'Landscape View', imagePath: '/Gallery2.jpg', altText: 'Landscape View', category: 'landscapes', featured: true },
  { title: 'Fashion Shoot', imagePath: '/Gallery3.jpg', altText: 'Fashion Shoot', category: 'fashion', featured: true },
  { title: 'Event Coverage', imagePath: '/Gallery4.jpg', altText: 'Event Coverage', category: 'events', featured: false },
  { title: 'Wildlife Capture', imagePath: '/Gallery5.jpg', altText: 'Wildlife Capture', category: 'wildlife', featured: false },
  { title: 'Nature Beauty', imagePath: '/Hero2.jpg', altText: 'Nature Beauty', category: 'landscapes', featured: false },
  { title: 'Urban Exploration', imagePath: '/Hero3.jpg', altText: 'Urban Exploration', category: 'urban', featured: false },
  { title: 'Nature Scene', imagePath: '/Nature1.png', altText: 'Nature Beauty', category: 'landscapes', featured: false },
] as const;

const VIDEO_SOURCE = [
  { title: 'SAINAPNAP BY LENAMBA', youtubeId: 'axuNuWaIToE', category: 'events', description: 'Based on the video transcript, this is a song titled "SAINAPNAP BY LENAMBA" from Uncle Westiee Studios.' },
  { title: 'THE SUNSET AT LOSUK TOWN - Nairobi', youtubeId: 'QWUz8hmrtJU', category: 'landscapes', description: 'This video captures a serene sunset in Losuk Town, Samburu, Kenya, showing a river and rolling hills with a golden-orange glow.' },
  { title: 'PAPA MAASAI PERFORMANCE', youtubeId: 'yFrNnazQep8', category: 'events', description: 'This video captures a traditional Maasai dance performance at the Pilonje Mega Launch in Kenyatta Stadium, Maralal.' },
  { title: 'SAMBURU GOVERNORS CUP 2025 PREPARATION', youtubeId: 'jv5gAGERo68', category: 'events', description: 'This video provides an update on the preparations for the Samburu Governors Cup 2025, featuring interviews with local residents.' },
  { title: 'MERINA LOLCHURAGI WEDS REUBEN LEITORE', youtubeId: '31sWI0Fb8tY', category: 'weddings', description: 'This video records a traditional Samburu wedding ceremony, including the MC, cheers, and mentions of specific places.' },
  { title: 'JAMILA WEDS JEREMIAH - A SAMBURU WEDDING', youtubeId: 'DbccT3_tw8o', category: 'weddings', description: 'This video captures the traditional Samburu wedding of Jamila and Jeremiah in Nkejemuny Samburu, with performances by Lenarasha and Samsellah.' },
  { title: 'FELISTER WEDS ATINGAE - A SAMBURU WEDDING', youtubeId: 'S0IX1sQ8zRo', category: 'weddings', description: "This video documents the traditional Samburu wedding of Felister and Atingae, featuring the arrival of the groom's family, speeches, and performances by Samsellah and Starcab." },
  { title: 'DIANA WEDS NDECCAH - A SAMBURU WEDDING', youtubeId: 'iJzD2C_dO3E', category: 'weddings', description: 'This video documents the Samburu wedding of Diana and Ndeccah in Maralal, featuring performances by Fantez and Starca B.' },
] as const;

export type DefaultGalleryImage = {
  id: string;
  title: string;
  description: string | null;
  imagePath: string;
  altText: string;
  slug: string;
  category: string | null;
  sortOrder: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DefaultVideo = {
  id: string;
  title: string;
  description: string | null;
  sourceType: 'youtube' | 'upload';
  youtubeUrl: string | null;
  youtubeId: string | null;
  videoPath: string | null;
  category: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type DefaultHeroSlide = {
  id: string;
  heroSectionId: string;
  imagePath: string;
  altText: string;
  sortOrder: number;
  isDraft: boolean;
  createdAt: Date;
};

function slugFromTitle(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

export function getDefaultGalleryImages(): DefaultGalleryImage[] {
  return GALLERY_SOURCE.map((img, i) => ({
    id: `default-gallery-${i}`,
    title: img.title,
    description: null,
    imagePath: img.imagePath,
    altText: img.altText,
    slug: slugFromTitle(img.title),
    category: img.category,
    sortOrder: i,
    featured: img.featured,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }));
}

export function getDefaultVideos(): DefaultVideo[] {
  return VIDEO_SOURCE.map((video, i) => ({
    id: `default-video-${i}`,
    title: video.title,
    description: video.description,
    sourceType: 'youtube' as const,
    youtubeUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    youtubeId: video.youtubeId,
    videoPath: null,
    category: video.category,
    sortOrder: i,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }));
}

export function getDefaultHeroSlides(heroSectionId = ''): DefaultHeroSlide[] {
  return DEFAULT_HERO_SLIDES.map((slide, i) => ({
    id: `default-hero-slide-${i}`,
    heroSectionId,
    imagePath: slide.imagePath,
    altText: slide.altText,
    sortOrder: slide.sortOrder,
    isDraft: false,
    createdAt: new Date(0),
  }));
}

export function getDefaultPublishedHero() {
  return {
    ...DEFAULT_HERO_META,
    slides: getDefaultHeroSlides(),
  };
}

export function findDefaultGalleryBySlug(slug: string): DefaultGalleryImage | undefined {
  return getDefaultGalleryImages().find((img) => img.slug === slug);
}

export { GALLERY_SOURCE as defaultGallerySource, VIDEO_SOURCE as defaultVideoSource, DEFAULT_HERO_SLIDES as defaultHeroSlideSource };
