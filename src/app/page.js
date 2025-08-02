"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { useState, useEffect, useCallback } from 'react';

// Component Imports - Assuming these are optimized as well
import Navbar from './Components/navbar';
import PortfolioCarousel from './Components/PortfolioCarousel';
import AboutPage from './Pages/about';
import Footer from './Components/footer';
import Packages from './Pages/packages';
import ServicesHero from './Pages/ServicesHero';
import ServicesPage from './Pages/services';

// Static data and assets
// These images are above-the-fold and essential, so they are not lazy-loaded.
// Consider using a CDN for production to serve these assets even faster.
const HERO_IMAGES = ['/Hero1.webp', '/Hero2.webp', '/Hero3.webp'];
const LOGO_SRC = '/Hero4.png';
const LOGO_ALT = 'Uncle Westiee Studios logo';
const TYPEWRITER_WORDS = ['Uncle Westiee', 'Studios'];

export default function Home() {
  const [current, setCurrent] = useState(0);

  // Use useCallback to memoize the function and prevent re-creation on every render.
  const handleNextImage = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  // Use useEffect for side effects like intervals.
  // The dependency array ensures the interval is only set up once.
  useEffect(() => {
    const interval = setInterval(handleNextImage, 5000);
    return () => clearInterval(interval); // Cleanup function to prevent memory leaks
  }, [handleNextImage]);

  // Use useMemo for heavy calculations if needed. Not necessary here, but a good practice.
  // const containerVariants = useMemo(() => ({ ... }), []);

  // Framer Motion variants for a cleaner component body
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  const logoVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
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
            <Image
              src={HERO_IMAGES[current]}
              alt={`Hero background image ${current + 1} for Uncle Westiee Studios`}
              fill
              sizes="100vw"
              priority={current === 0} // Only set priority for the initial image
              className="object-cover object-center"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black opacity-40" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            className="mb-4"
          >
            <Image
              src={LOGO_SRC}
              alt={LOGO_ALT}
              width={300}
              height={300}
              priority
            />
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            <Typewriter
              words={TYPEWRITER_WORDS}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </h1>
        </div>
      </motion.section>

      {/* Additional Sections - Lazy load if possible */}
      <ServicesPage />
      <AboutPage />
      <PortfolioCarousel />
      <ServicesHero />
      <Packages />
      <Footer />
    </>
  );
}