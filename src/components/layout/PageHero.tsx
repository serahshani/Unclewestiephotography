'use client';

import Image from 'next/image';
import HeroBreadcrumbs from '@/components/seo/HeroBreadcrumbs';
import type { PageBreadcrumbItem } from '@/lib/page-breadcrumbs';
import type { ReactNode } from 'react';

interface PageHeroProps {
  image: string;
  imageAlt: string;
  title: ReactNode;
  subtitle?: string;
  breadcrumbs: PageBreadcrumbItem[];
  priority?: boolean;
  /** Tailwind height class, e.g. h-96 or h-[60vh] */
  heightClass?: string;
  /** Tailwind object-position class for image focal point */
  imagePosition?: string;
  /** Tailwind brightness class on the image */
  imageBrightness?: string;
}

export default function PageHero({
  image,
  imageAlt,
  title,
  subtitle,
  breadcrumbs,
  priority = false,
  heightClass = 'h-[60vh] min-h-[380px]',
  imagePosition = 'object-center',
  imageBrightness = 'brightness-[.45]',
}: PageHeroProps) {
  return (
    <section
      className={`relative w-full overflow-hidden text-white ${heightClass}`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        className={`object-cover ${imagePosition} ${imageBrightness}`}
        priority={priority}
        sizes="100vw"
      />

      <HeroBreadcrumbs items={breadcrumbs} />

      <div className="relative z-10 w-full px-4 pb-10 pt-4 sm:absolute sm:inset-0 sm:flex sm:items-center sm:justify-center sm:px-6 sm:pb-0 sm:pt-0 md:px-10">
        <div className="w-full text-center sm:mt-8 md:mt-10">
          <h1 className="mb-3 w-full text-3xl font-extrabold leading-tight drop-shadow-lg sm:mb-4 sm:text-4xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="w-full text-base italic drop-shadow-md sm:mx-auto sm:max-w-4xl sm:text-lg md:text-2xl">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
