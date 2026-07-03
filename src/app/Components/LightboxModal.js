'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function LightboxModal({ media, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (!media) return null;

  const caption = media.type === 'image' ? media.alt : media.title;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={caption || 'Media preview'}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/95"
        onClick={onClose}
        aria-label="Close preview"
      />

      <div
        className="relative z-10 flex max-h-[96vh] w-full max-w-[min(96vw,1600px)] flex-col"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex shrink-0 items-center justify-end gap-3">
          {media.type === 'image' && media.slug && (
            <Link
              href={`/portfolio/${media.slug}`}
              className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              View details
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center">
          {media.type === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.src}
              alt={media.alt || 'Gallery image'}
              className="max-h-[calc(96vh-7rem)] max-w-full object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          ) : media.type === 'video' && media.videoSource === 'upload' && media.src ? (
            <video
              src={media.src}
              controls
              autoPlay
              playsInline
              className="max-h-[calc(96vh-7rem)] max-w-full bg-black"
            />
          ) : (
            <div className="aspect-video w-full max-w-[min(96vw,1200px)] bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${media.videoId}?autoplay=1`}
                title={media.title || 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          )}
        </div>

        {(caption || media.description) && (
          <div className="mt-4 shrink-0 px-1 text-center">
            {caption && <p className="text-base font-medium text-white">{caption}</p>}
            {media.type === 'video' && media.description && (
              <p className="mt-1 text-sm leading-relaxed text-white/70">{media.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
