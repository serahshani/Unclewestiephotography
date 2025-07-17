import Link from 'next/link';
// Import Image component for optimized logos
import Image from 'next/image';
import { Facebook, Instagram, Mail, ChevronUp } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white text-black py-12 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        {/* Logo & Title */}
        <div className="mb-6">
          {/* Replaced text-based UW with Next.js Image component */}
          <Link href="/" className="inline-block" aria-label="Home"> {/* Wrap logo in Link to go home */}
            <Image
              src='/Uncle-westiee.png' // Path to your logo image in the public folder
              alt='Uncle Westiee Studios Logo'
              width={60} // Adjust width as needed for your logo's size in the footer
              height={20} // Adjust height to maintain aspect ratio
              className="object-contain" // Ensures the logo fits within the given dimensions
            />
          </Link>
          <h2 className="text-3xl font-serif font-bold text-green-900 mt-2">Uncle Westiee</h2> {/* Adjusted margin top */}
          <p className="text-sm tracking-widest text-green-900">Studios</p>
        </div>

        {/* Tagline */}
        <p className="text-black mb-8">
          Feel free to contact us and follow on social media
        </p>

        {/* Social Icons */}
        <div className="flex justify-items-start justify-center space-x-10 text-green-950">
          <Link href="https://www.facebook.com/p/Uncle_westiee-photography-100076434076242/" target="_blank" aria-label="Facebook">
            <Facebook size={28} className="hover:text-gray-700" />
          </Link>
          <Link href="https://www.instagram.com/uncle_westiee_studios/?hl=en" target="_blank" aria-label="Instagram">
            <Instagram size={28} className="hover:text-gray-700" />
          </Link>
          <Link href="mailto:info@unclywestieestudios.co.ke" aria-label="Email">
            <Mail size={28} className="hover:text-gray-700" />
          </Link>
          <Link href="https://wa.me/+254791264173" target="_blank" aria-label="WhatsApp">
            <FaWhatsapp size={28} className="hover:text-black" />
          </Link>
          <Link href="#top" aria-label="Back to top">
            <ChevronUp size={28} className="hover:text-gray-700" />
          </Link>
        </div>
      </div>
    </footer>
  );
}