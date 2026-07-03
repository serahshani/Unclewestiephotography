'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import { getDefaultGalleryImages } from '@/lib/default-content';

const defaultImages = getDefaultGalleryImages()
  .filter((img) => img.featured)
  .map((img) => ({
    src: img.imagePath,
    alt: img.altText,
  }));

interface PortfolioCarouselProps {
  images?: { src: string; alt: string }[];
}

export default function PortfolioCarousel({ images }: PortfolioCarouselProps) {
  const portfolioImages = images && images.length > 0 ? images : defaultImages;

  return (
    <section className="overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#012D26]/70 sm:text-sm">
              Portfolio
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium text-gray-900 sm:text-4xl">
              Selected work
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="text-sm font-semibold text-[#012D26] underline underline-offset-4 hover:text-[#014a3d]"
          >
            View full gallery
          </Link>
        </div>

        <div className="relative [&_.swiper-slide]:[backface-visibility:hidden] [&_.swiper-slide]:[transform:translateZ(0)]">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            loop={portfolioImages.length > 1}
            spaceBetween={16}
            slidesPerView={1.15}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              1024: { slidesPerView: 2.2, spaceBetween: 24 },
            }}
            className="!overflow-visible"
          >
            {portfolioImages.map((image, idx) => (
              <SwiperSlide key={`${image.src}-${idx}`}>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    quality={92}
                    priority={idx < 3}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 55vw, 640px"
                    className="object-cover object-center"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
