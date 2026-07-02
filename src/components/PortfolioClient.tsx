'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import LightboxModal from '@/app/Components/LightboxModal';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { getYouTubeThumbnail } from '@/lib/youtube';
import type { PageBreadcrumbItem } from '@/lib/page-breadcrumbs';

export interface MediaItem {
  type: 'image' | 'video';
  src?: string;
  alt?: string;
  slug?: string;
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
  breadcrumbs?: PageBreadcrumbItem[];
}

export default function PortfolioClient({
  categories,
  allMedia,
  mediaByCategory,
  breadcrumbs,
}: PortfolioClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredMedia =
    activeCategory === 'all'
      ? allMedia
      : mediaByCategory[activeCategory] ?? [];

  const openLightbox = (mediaItem: MediaItem) => {
    setSelectedMedia(mediaItem);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedMedia(null);
  };

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16">
        <div className="container mx-auto px-6 pt-28 lg:px-10">
          {breadcrumbs && (
            <div className="mb-10">
              <Breadcrumbs items={breadcrumbs} variant="dark" />
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-extrabold text-center text-[#012D26] mb-6 leading-tight">
            Our Visual Journey
          </h1>
          <p className="max-w-4xl mx-auto text-center text-xl text-gray-700 mb-10 italic">
            Every click tells a story. Explore our curated collection of moments, captured through the lens and brought to life through light and emotion.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300
                  ${activeCategory === cat.id
                    ? 'bg-[#012D26] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#012D26] mb-16 relative pb-6">
            <span className="relative z-10">
              {categories.find((cat) => cat.id === activeCategory)?.name ?? 'Gallery'}
            </span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-[#012D26] rounded-full opacity-70" />
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-24">
            {filteredMedia.length > 0 ? (
              filteredMedia.map((mediaItem, index) => (
                <div
                  key={`${mediaItem.type}-${mediaItem.src ?? mediaItem.videoId ?? mediaItem.title}-${index}`}
                  className="relative w-full overflow-hidden group rounded-md shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  <div className="relative w-full" style={{ paddingTop: '100%' }}>
                    {mediaItem.type === 'image' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => openLightbox(mediaItem)}
                          className="absolute inset-0 w-full h-full cursor-pointer"
                          aria-label={`View ${mediaItem.alt} in lightbox`}
                        >
                          <Image
                            src={mediaItem.src!}
                            alt={mediaItem.alt || 'Gallery image'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index < 4}
                          />
                        </button>
                        {mediaItem.slug && (
                          <Link
                            href={`/portfolio/${mediaItem.slug}`}
                            className="absolute top-3 right-3 z-10 bg-white/90 text-[#012D26] text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View details
                          </Link>
                        )}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-start p-4 transition-opacity duration-300">
                          <p className="text-white text-lg font-semibold tracking-wide capitalize">
                            {mediaItem.alt}
                          </p>
                        </div>
                      </>
                    ) : mediaItem.videoSource === 'upload' && mediaItem.src ? (
                      <button
                        type="button"
                        onClick={() => openLightbox(mediaItem)}
                        className="absolute inset-0 w-full h-full cursor-pointer"
                        aria-label={`Play video ${mediaItem.title}`}
                      >
                        <video
                          src={mediaItem.src}
                          muted
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div className="p-4 bg-white absolute bottom-0 left-0 right-0 text-left">
                          <p className="text-lg font-semibold text-gray-800">{mediaItem.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">{mediaItem.description}</p>
                        </div>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openLightbox(mediaItem)}
                        className="absolute inset-0 w-full h-full cursor-pointer"
                        aria-label={`Play video ${mediaItem.title}`}
                      >
                        <Image
                          src={getYouTubeThumbnail(mediaItem.videoId!)}
                          alt={`Thumbnail for ${mediaItem.title}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div className="p-4 bg-white absolute bottom-0 left-0 right-0 text-left">
                          <p className="text-lg font-semibold text-gray-800">{mediaItem.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">{mediaItem.description}</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600 text-xl">No media found for this category.</p>
            )}
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <LightboxModal media={selectedMedia} onClose={closeLightbox} />
      )}
    </>
  );
}
