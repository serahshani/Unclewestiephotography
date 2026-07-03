'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import LightboxModal from '@/app/Components/LightboxModal';
import PublicImage from '@/components/PublicImage';
import { getYouTubeThumbnail } from '@/lib/youtube';
import { trackGalleryView } from '@/lib/gallery-view-tracker';

export interface MediaItem {
  type: 'image' | 'video';
  src?: string;
  alt?: string;
  slug?: string;
  galleryId?: string;
  videoSource?: 'youtube' | 'upload';
  videoId?: string;
  title?: string;
  description?: string;
  category?: string;
  sortOrder?: number;
  createdAt?: number;
}

interface PortfolioClientProps {
  categories: { id: string; name: string }[];
  allMedia: MediaItem[];
  mediaByCategory: Record<string, MediaItem[]>;
}

function PlayIcon() {
  return (
    <svg className="h-12 w-12 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PortfolioImage({
  src,
  alt,
  priority,
  onOpen,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden"
      aria-label={`View ${alt} full size`}
    >
      <PublicImage
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
        style={{ width: '100%', height: 'auto' }}
        priority={priority}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="text-left text-sm font-medium text-white">{alt}</p>
      </div>
    </button>
  );
}

export default function PortfolioClient({
  categories,
  allMedia,
  mediaByCategory,
}: PortfolioClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredMedia =
    activeCategory === 'all' ? allMedia : mediaByCategory[activeCategory] ?? [];

  const activeLabel =
    categories.find((cat) => cat.id === activeCategory)?.name ?? 'Gallery';

  const openLightbox = (mediaItem: MediaItem) => {
    if (mediaItem.type === 'image') {
      trackGalleryView(mediaItem.galleryId);
    }
    setSelectedMedia(mediaItem);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedMedia(null);
  };

  return (
    <>
      <main id="portfolio-gallery" className="bg-white">
        <section className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:py-16">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-medium text-[#012D26] sm:text-3xl">
              Gallery: {activeLabel}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Uncle Westiee Studios portfolio — full-size wedding, event, portrait, and film work
              across Kenya. Tap to enlarge or open a photo&apos;s detail page.
            </p>
          </div>

          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Portfolio categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#012D26] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-current={activeCategory === cat.id ? 'true' : undefined}
              >
                {cat.name}
              </button>
            ))}
          </nav>

          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {filteredMedia.length > 0 ? (
              filteredMedia.map((mediaItem, index) => (
                <article
                  key={`${mediaItem.type}-${mediaItem.src ?? mediaItem.videoId ?? mediaItem.title}-${index}`}
                  className="mb-4 break-inside-avoid"
                >
                  {mediaItem.type === 'image' ? (
                    <div className="group">
                      <PortfolioImage
                        src={mediaItem.src!}
                        alt={mediaItem.alt || mediaItem.title || 'Gallery image'}
                        priority={index < 4}
                        onOpen={() => openLightbox(mediaItem)}
                      />
                      {mediaItem.slug ? (
                        <h3 className="mt-2 text-sm font-medium leading-snug">
                          <Link
                            href={`/portfolio/${mediaItem.slug}`}
                            className="text-[#012D26] hover:underline"
                          >
                            {mediaItem.title || mediaItem.alt}
                          </Link>
                        </h3>
                      ) : (
                        mediaItem.title && (
                          <p className="mt-2 text-sm font-medium text-gray-800">{mediaItem.title}</p>
                        )
                      )}
                    </div>
                  ) : mediaItem.videoSource === 'upload' && mediaItem.src ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => openLightbox(mediaItem)}
                        className="group relative block w-full overflow-hidden"
                        aria-label={`Play video ${mediaItem.title}`}
                      >
                      <video
                        src={mediaItem.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-auto w-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
                        <PlayIcon />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left">
                        <p className="text-sm font-medium text-white">{mediaItem.title}</p>
                      </div>
                      </button>
                      {mediaItem.title && (
                        <h3 className="mt-2 text-sm font-medium text-gray-900">{mediaItem.title}</h3>
                      )}
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => openLightbox(mediaItem)}
                        className="group relative block w-full overflow-hidden"
                        aria-label={`Play video ${mediaItem.title}`}
                      >
                      <Image
                        src={getYouTubeThumbnail(mediaItem.videoId!)}
                        alt={`Thumbnail for ${mediaItem.title}`}
                        width={0}
                        height={0}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="h-auto w-full"
                        style={{ width: '100%', height: 'auto' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
                        <PlayIcon />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left">
                        <p className="text-sm font-medium text-white">{mediaItem.title}</p>
                      </div>
                      </button>
                      {mediaItem.title && (
                        <h3 className="mt-2 text-sm font-medium text-gray-900">{mediaItem.title}</h3>
                      )}
                    </div>
                  )}
                </article>
              ))
            ) : (
              <p className="py-12 text-center text-sm text-gray-600">No media found for this category.</p>
            )}
          </div>

          <p className="mt-12 text-center text-sm text-gray-500">
            Like what you see?{' '}
            <Link href="/packages" className="font-medium text-[#012D26] hover:underline">
              View packages
            </Link>
            {' · '}
            <Link href="/contact" className="font-medium text-[#012D26] hover:underline">
              Book a session
            </Link>
          </p>
        </section>
      </main>

      {lightboxOpen && <LightboxModal media={selectedMedia} onClose={closeLightbox} />}
    </>
  );
}
