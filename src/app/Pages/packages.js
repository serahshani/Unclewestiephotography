'use client';

import { useState } from 'react';
import Image from 'next/image'; // Import the Next.js Image component

const PHONE_NUMBER = '+254791264173'; // ← replace with your WhatsApp number (no “+”, no spaces)
const WHATSAPP_BASE = `https://wa.me/${PHONE_NUMBER}`;

const PACKAGES = [
  {
    id: 'solo',
    title: 'Solo Photoshoot',
    image: '/solo.jpg', // Replace with your image path or URL
    bullets: [
      'Scenic view location',
      '12 professionally edited photos (selected by you)',
      '10 days delivery',
    ],
  },
  {
    id: 'couple',
    title: 'Couple Photoshoot / Proposal',
    image: '/couple.jpg', // Replace with your image path or URL
  
    bullets: [
      'Scenic view location',
      '15 professionally edited photos (selected by you)',
      '15 days delivery',
    ],
  },
  {
    id: 'family',
    title: 'Family Photoshoot',
    image: '/family.jpg', // Replace with your image path or URL
    bullets: [
      'Scenic view location',
      '3 pax included',
      '12 professionally edited photos',
      '15 days delivery',
    ],
  },
  // Removed the 'flying' package from here
];

export default function Packages() {
  // track duration per package id (defaults to '1')
  const [durations, setDurations] = useState(
    PACKAGES.reduce((acc, pkg) => ({ ...acc, [pkg.id]: '1' }), {})
  );

  const toggleDuration = (id) => {
    setDurations((prev) => ({
      ...prev,
      [id]: prev[id] === '1' ? '2' : '1',
    }));
  };

  return (
    <section id="packages" className="bg-gray-200 py-16 px-4">
      <h2 className="text-4xl font-serif text-center text-[#012D26] mb-12">Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {PACKAGES.map((pkg) => {
          const dur = durations[pkg.id];
          const message = `Hello! I'd like to book the *${pkg.title}* package for *${dur} hour(s)*.`;
          const waLink = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col
                         transform transition-all duration-300 hover:scale-105 hover:shadow-xl" // Added animation classes
            >
              {/* Title */}
              <h3 className="text-center text-lg text-[#012D26] font-serif font-semibold py-4">
                {pkg.title}
              </h3>

              {/* Image */}
              <div className="flex-1">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  width={500} // Example width, adjust as needed
                  height={300} // Example height, adjust as needed
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Duration Toggle */}
              <div className="flex items-center text-[#012D26] justify-center py-4 space-x-4">
                <span className="text-sm">1 hour</span>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dur === '2'}
                    onChange={() => toggleDuration(pkg.id)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-4 bg-gray-300 peer-checked:bg-gray-500 rounded-full peer-focus:ring-2 peer-focus:ring-gray-400 transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                </label>
                <span className="text-sm">2 hours</span>
              </div>

              {/* Price & Details */}
              <div className="px-6 pb-6">
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-4">
                  <li>{dur} hour{dur !== '1' && 's'}</li>
                  {pkg.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                {/* INQUIRE NOW */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-[#012D26] text-white py-2 rounded hover:bg-gray-800 transition"
                >
                  INQUIRE NOW
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}