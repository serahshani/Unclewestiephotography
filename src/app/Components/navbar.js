'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about#about-section', label: 'About' },
  { href: '/services#services-section', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/packages#packages-section', label: 'Packages' },
  { href: '/contact', label: 'Contact' },
];

const menuVariants = {
  closed: { x: '100%' },
  open: { x: 0 },
};

const linkVariants = {
  closed: { opacity: 0, x: 24 },
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 + i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full rounded-b-3xl text-white shadow-lg backdrop-blur-md transition-colors duration-300 ${
          scrolled ? 'bg-[#012D26]/90' : 'bg-[#012D26]/70'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center font-extrabold tracking-tight text-white">
            <Image
              src="/Westieelogo.png"
              alt="Uncle Westiee Studios"
              width={60}
              height={20}
              priority
              className="object-contain"
            />
          </Link>

          <div className="hidden space-x-8 md:flex">
            {links.map(({ href, label }) => (
              <motion.div key={href} whileHover={{ y: -2 }} className="relative">
                <Link
                  href={href}
                  className="text-sm font-medium uppercase tracking-wide text-white transition-colors duration-200 hover:text-green-300"
                  onClick={closeMenu}
                >
                  {label}
                </Link>
                <motion.div
                  className="absolute left-0 right-0 h-0.5 rounded bg-green-300"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  style={{ originX: 0 }}
                />
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            className="cursor-pointer text-white focus:outline-none md:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/50 md:hidden"
              onClick={closeMenu}
              aria-label="Close menu"
            />

            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,300px)] flex-col bg-[#012D26] shadow-2xl md:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <Image
                  src="/Westieelogo.png"
                  alt="Uncle Westiee Studios"
                  width={56}
                  height={18}
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={closeMenu}
                  className="cursor-pointer text-white"
                  aria-label="Close menu"
                >
                  <HiX size={26} />
                </button>
              </div>

              <ul className="flex flex-1 flex-col justify-center gap-1 px-6 py-8">
                {links.map(({ href, label }, index) => (
                  <motion.li
                    key={href}
                    custom={index}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      href={href}
                      onClick={closeMenu}
                      className="group flex items-center gap-4 border-b border-white/10 py-4 transition-colors hover:border-green-300/40"
                    >
                      <span className="text-xs tracking-[0.25em] text-white/35">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-2xl font-light tracking-wide text-white transition-colors group-hover:text-green-300">
                        {label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="border-t border-white/10 px-6 py-6">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="block w-full bg-white py-3 text-center text-sm font-semibold uppercase tracking-wider text-[#012D26] transition-colors hover:bg-green-100"
                >
                  Book a session
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
