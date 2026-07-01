import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, ChevronUp } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { CONTACT, NAV_LINKS, SOCIAL } from '@/lib/site-config';

export default function Footer() {
  return (
    <footer className="bg-white text-black py-12 px-4 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">
          <div>
            <Link href="/" className="inline-block" aria-label="Home">
              <Image
                src="/Uncle-westiee.png"
                alt="Uncle Westiee Studios Logo"
                width={60}
                height={20}
                className="object-contain mx-auto md:mx-0"
              />
            </Link>
            <h2 className="text-xl font-serif font-bold text-green-900 mt-3">
              Uncle Westiee Studios
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Photography &amp; videography in Kenya
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="font-semibold text-[#012D26] mb-4">Explore</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-600 hover:text-[#012D26] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-semibold text-[#012D26] mb-4">Contact</h3>
            <p className="text-gray-600 text-sm mb-2">{CONTACT.location}</p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-gray-600 hover:text-[#012D26] text-sm block mb-2"
            >
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phone}`}
              className="text-gray-600 hover:text-[#012D26] text-sm block"
            >
              {CONTACT.phone}
            </a>
          </div>
        </div>

        <div className="flex justify-center space-x-8 text-green-950 border-t border-gray-100 pt-8">
          <Link href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook size={24} className="hover:text-gray-700" />
          </Link>
          <Link href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram size={24} className="hover:text-gray-700" />
          </Link>
          <Link href={`mailto:${CONTACT.email}`} aria-label="Email">
            <Mail size={24} className="hover:text-gray-700" />
          </Link>
          <Link href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp size={24} className="hover:text-black" />
          </Link>
          <Link href="#main-content" aria-label="Back to top">
            <ChevronUp size={24} className="hover:text-gray-700" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
