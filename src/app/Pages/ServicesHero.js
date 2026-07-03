import Image from 'next/image';
import Link from 'next/link';
import { CONTACT } from '@/lib/site-config';

export default function ServicesHero() {
  return (
    <section id="services" className="relative min-h-[420px] overflow-hidden sm:min-h-[520px] md:min-h-[600px]">
      <Image
        src="/Services-hero.jpg"
        alt="Wedding photography by Uncle Westiee Studios in Kenya"
        fill
        className="object-cover object-[center_30%] sm:object-right"
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

      <div className="relative mx-auto flex h-full min-h-[420px] max-w-6xl items-end px-4 py-14 sm:min-h-[520px] sm:px-6 sm:py-20 md:min-h-[600px]">
        <div className="max-w-xl text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-sm">
            Weddings
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
            Your day, beautifully documented
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
            From getting ready to the last dance — candid moments, family portraits, and cinematic
            detail shots. Packages tailored to your celebration in Nairobi, Samburu, and beyond.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/packages"
              className="inline-block bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              View wedding packages
            </Link>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-white px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
            >
              Send enquiry
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
