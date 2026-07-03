'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CONTACT } from '@/lib/site-config';

const PACKAGES = [
  {
    id: 'solo',
    title: 'Solo Photoshoot',
    image: '/solo.jpg',
    bullets: [
      'Scenic view location',
      '12 professionally edited photos (selected by you)',
    ],
    description: 'Perfect for personal branding, modeling, or capturing your essence.',
  },
  {
    id: 'couple',
    title: 'Couple / Proposal',
    image: '/couple.jpg',
    bullets: [
      'Scenic view location',
      '15 professionally edited photos (selected by you)',
    ],
    description: 'Capture your love story or that special proposal moment.',
  },
  {
    id: 'family',
    title: 'Family Photoshoot',
    image: '/family.jpg',
    bullets: [
      'Scenic view location',
      '3 pax included',
      '12 professionally edited photos',
    ],
    description: 'Ideal for family portraits, reunions, or special occasions.',
  },
];

export default function Packages() {
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
    <section id="packages" className="bg-white px-4 py-14 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#012D26]/70 sm:text-sm">
              Portrait sessions
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium text-gray-900 sm:text-4xl">
              Session packages
            </h2>
            <p className="mt-3 max-w-xl text-sm text-gray-600 sm:text-base">
              On-location shoots with edited digital galleries. Toggle duration, then inquire on
              WhatsApp.
            </p>
          </div>
          <Link
            href="/packages"
            className="text-sm font-semibold text-[#012D26] underline underline-offset-4 hover:text-[#014a3d]"
          >
            All packages
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {PACKAGES.map((pkg) => {
            const dur = durations[pkg.id];
            const message = `Hello! I'd like to book the *${pkg.title}* package for *${dur} hour(s)*.`;
            const waLink = `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

            return (
              <article key={pkg.id} className="flex flex-col">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="flex flex-1 flex-col border border-t-0 border-gray-200 px-5 py-6">
                  <h3 className="font-serif text-xl font-medium text-gray-900">{pkg.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{pkg.description}</p>

                  <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
                    <li className="flex gap-2">
                      <span className="text-[#012D26]">—</span>
                      <span>
                        {dur} hour{dur !== '1' ? 's' : ''}
                      </span>
                    </li>
                    {pkg.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="text-[#012D26]">—</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Duration
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center gap-2.5">
                      <span className={`text-sm ${dur === '1' ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                        1 hr
                      </span>
                      <span className="relative inline-flex h-5 w-10 items-center">
                        <input
                          type="checkbox"
                          checked={dur === '2'}
                          onChange={() => toggleDuration(pkg.id)}
                          className="peer sr-only"
                        />
                        <span className="h-5 w-10 rounded-full bg-gray-200 transition-colors peer-checked:bg-[#012D26]" />
                        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                      </span>
                      <span className={`text-sm ${dur === '2' ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                        2 hr
                      </span>
                    </label>
                  </div>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block bg-[#012D26] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#014a3d]"
                  >
                    Inquire on WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
