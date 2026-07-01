'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';

const defaultImages = [
  { src: '/Gallery1.jpg', alt: 'University Campus' },
  { src: '/Gallery2.jpg', alt: 'Beautiful Landscape with Mountains' },
  { src: '/Gallery3.jpg', alt: 'Professional Studios Setup' },
  { src: '/Gallery4.jpg', alt: 'Stunning Aurora Borealis' },
];

interface PortfolioCarouselProps {
  images?: { src: string; alt: string }[];
}

export default function PortfolioCarousel({ images }: PortfolioCarouselProps) {
  const portfolioImages = images && images.length > 0 ? images : defaultImages;

  return (
    <section className="bg-gray-200 py-16 px-4 text-center">
      <h2 className="text-3xl font-serif font-semibold mb-10 text-gray-800">
        Our Latest Work
      </h2>
      <div className="max-w-3xl mx-auto relative">
        <Swiper
          modules={[Autoplay, Navigation]}
          navigation={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={10}
          slidesPerView={1}
          className="mySwiper"
        >
          {portfolioImages.map((image, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-200 md:h-[700px] rounded-md overflow-hidden shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  quality={80}
                  priority={idx === 0}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Link
        href="/portfolio"
        className="mt-10 inline-block bg-green-900 text-white font-serif px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 transform hover:-translate-y-1"
      >
        View Full Gallery
      </Link>
    </section>
  );
}
