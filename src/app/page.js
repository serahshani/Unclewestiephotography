"use client";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { useState, useEffect } from 'react';
import Navbar from './Components/navbar';
import PortfolioCarousel from './Components/PortfolioCarousel';
import AboutPage from './Pages/about';
import Footer from './Components/footer';
import Packages from './Pages/packages';
import ServicesHero from './Pages/ServicesHero';
import ServicesPage from './Pages/services';

export default function Home() {
  // Hero background images
  const images = ['/Hero1.png', '/Hero2.jpg', '/Hero3.jpg'];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
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
        {/* Background Image Carousel with fade */}
        <AnimatePresence>
          <motion.div
            key={current}
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={images[current]}
              alt={`Hero background ${current}`}
              fill
              className="object-cover object-center"
              priority
            />
            <motion.div
              className="absolute inset-0 bg-black opacity-40"
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content with typing effect */}
        <div className="flex flex-col items-center justify-center h-full text-center text-white px-4">
          <motion.div
            className="border border-white rounded-md w-16 h-16 flex items-center justify-center mb-4 overflow-hidden" // Added overflow-hidden for good measure
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Replaced the <span> with an Image component for the logo */}
            <Image
              src="/Westieelogo.png" // <---- IMPORTANT: Replace with the actual path to your logo image
              alt="Uncle Westiee Logo"
              width={64}  // Adjust width as needed for your logo within the 64x64 container
              height={64} // Adjust height as needed for your logo within the 64x64 container
              className="object-contain" // Use object-contain to ensure the whole logo is visible, or object-cover if you want it to fill and potentially crop
            />
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            <Typewriter
              words={[ 'Uncle Westiee', 'Studios' ]}
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

      {/* About Section */}
      <ServicesPage />
      <AboutPage />

      {/* Portfolio Carousel */}
      <PortfolioCarousel />

      <ServicesHero />
      <Packages />
      <Footer />
    </>
  );
}