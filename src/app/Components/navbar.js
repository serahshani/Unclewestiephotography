"use client"; // <-- ADD THIS LINE AT THE VERY TOP

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

const links = [
  { href: '/about#about-section', label: 'ABOUT' },
  { href: '/services#services-section', label: 'SERVICES' },
  { href: '/portfolio', label: 'PORTFOLIO' },
  { href: '/packages#packages-section', label: 'PACKAGES' },
  // Removed the 'INQUIRE NOW' link
  { href: '/contact', label: 'CONTACT' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if window is defined to prevent errors during SSR
      if (typeof window !== 'undefined') {
        setScrolled(window.scrollY > 0);
      }
    };

    // Only add event listener on the client side
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-lg text-white rounded-b-3xl transition-colors duration-300 ${
        scrolled
          ? 'bg-[#012D26] bg-opacity-90'
          : 'bg-[#012D26] bg-opacity-70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-extrabold tracking-tight flex items-center">
          <Image
            src='/Westieelogo.png'
            alt='Uncle Westiee Studios Logo'
            width={60}
            height={20}
            priority
            className="object-contain"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          {links.map(({ href, label }) => (
            <motion.div key={href} whileHover={{ y: -2 }} className="relative">
              <Link
                href={href}
                className="text-white text-sm font-medium uppercase tracking-wide hover:text-green-300 transition-colors duration-200"
                scroll={false}
              >
                {label}
              </Link>
              {/* Underline on hover */}
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-green-300 rounded"
                layoutId={`underline-${href}`}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                style={{ originX: 0 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden md:hidden ${
              scrolled ? 'bg-green-900 bg-opacity-95' : 'bg-[#053B05] bg-opacity-90'
            }`}
          >
            <ul className="flex flex-col space-y-4 px-6 py-4">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block text-white text-base font-medium uppercase tracking-wide hover:text-green-300 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                    scroll={false}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}