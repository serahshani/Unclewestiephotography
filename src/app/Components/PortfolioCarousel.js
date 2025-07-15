'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Image from 'next/image'; // Import the Next.js Image component
import Link from 'next/link'; // Import Link for proper Next.js navigation

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const portfolioImages = [
  {
    src: '/Gallery1.jpg', // Local image in the public folder
    alt: 'University Campus',
  },
  {
    src: '/Gallery2.jpg', // Local image in the public folder
    alt: 'Beautiful Landscape with Mountains',
  },
  {
    src: '/Gallery3.jpg', // Local image in the public folder
    alt: 'Professional Studios Setup',
  },
  {
    src: '/Gallery4.jpg', // Local image in the public folder
    alt: 'Stunning Aurora Borealis',
  },
  // Add more images as needed
];

export default function PortfolioCarousel() {
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
                  priority={idx === 0} // Prioritize loading the first image
                  fill={true} // Replaces 'layout="fill"' for Next.js 13+
                  className="object-cover" // Replaces 'objectFit="cover"' for Next.js 13+
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Link
        href="/portfolio" // Assuming your PortfolioPage is at /portfolio route
        passHref
        className="mt-10 inline-block bg-green-900 text-white font-serif px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 transform hover:-translate-y-1"
      >
        View Full Gallery
      </Link>
    </section>
  );
}