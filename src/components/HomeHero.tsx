'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { useState, useEffect, useCallback } from 'react';
import PublicImage from '@/components/PublicImage';

interface HeroSlide {
  id?: string;
  imagePath: string;
  altText: string;
}

interface HomeHeroProps {
  slides: HeroSlide[];
  typewriterWords: string[];
  logoPath?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  seoH1: string;
  seoSubtitle?: string;
}

export default function HomeHero({
  slides,
  typewriterWords,
  logoPath,
  ctaText,
  ctaUrl,
  seoH1,
  seoSubtitle,
}: HomeHeroProps) {
  const [current, setCurrent] = useState(0);
  const heroImages = slides.length > 0 ? slides : [{ imagePath: '/Hero1.webp', altText: 'Hero' }];

  const handleNextImage = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    const interval = setInterval(handleNextImage, 5000);
    return () => clearInterval(interval);
  }, [handleNextImage]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  const logoVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  };

  return (
    <motion.section
      className="relative w-full h-screen overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <PublicImage
            src={heroImages[current].imagePath}
            alt={heroImages[current].altText}
            fill
            sizes="100vw"
            priority={current === 0}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black opacity-40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="mb-4"
        >
          {logoPath ? (
            <PublicImage
              src={logoPath}
              alt="Uncle Westiee Studios logo"
              width={300}
              height={300}
              priority
            />
          ) : null}
        </motion.div>

        <h1 className="sr-only">{seoH1}</h1>
        {seoSubtitle ? (
          <p className="mb-3 max-w-xl text-sm font-medium text-white/90 sm:text-base">
            {seoSubtitle}
          </p>
        ) : null}
        <p
          className="text-3xl font-bold leading-tight md:text-5xl"
          aria-hidden="true"
        >
          <Typewriter
            words={typewriterWords.length > 0 ? typewriterWords : ['Uncle Westiee', 'Studios']}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={100}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </p>

        {ctaText && ctaUrl && (
          <Link
            href={ctaUrl}
            className="mt-8 bg-white text-[#012D26] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </motion.section>
  );
}
