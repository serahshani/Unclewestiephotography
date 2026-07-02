import Image from 'next/image';
import Link from 'next/link';
import { Camera, Briefcase, Sparkles, Satellite } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import { FEATURED_SERVICES, SUPPORTING_SERVICES } from '@/lib/services-data';
import { SERVICES_BREADCRUMBS } from '@/lib/page-breadcrumbs';

const SUPPORTING_ICONS = {
  'Commercial & Product': Briefcase,
  'Professional Videography': Camera,
  'Drone Services': Satellite,
  'Expert Retouching & Editing': Sparkles,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        image="/Servicespagehero.jpg"
        imageAlt="Photography and videography services by Uncle Westiee Studios in Kenya"
        title="Photography & Videography Services"
        subtitle="Wedding, portrait, event, and commercial coverage — Nairobi, Samburu, and across Kenya."
        breadcrumbs={SERVICES_BREADCRUMBS}
        heightClass="h-[600px] max-h-[80vh]"
        imagePosition="object-[center_25%]"
        imageBrightness="brightness-[.4]"
        priority
      />

      <main id="services-section">
        <section className="bg-white px-6 py-24">
          <div className="container mx-auto max-w-5xl">
            <div className="mx-auto mb-20 max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-[#012D26]/70">
                Services
              </span>
              <h2 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">What We Offer</h2>
              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#012D26]" />
              <p className="mt-5 text-lg text-gray-600">
                Professional photography and videography for weddings, events, portraits, and
                brands — tailored to the moment you&apos;re trying to capture.{' '}
                <Link href="/portfolio" className="font-medium text-[#012D26] hover:underline">
                  View our portfolio
                </Link>
                .
              </p>
            </div>

            <div className="space-y-16 md:space-y-24">
              {FEATURED_SERVICES.map((service, index) => (
                <article
                  id={service.id}
                  key={service.id}
                  className={`flex flex-col items-center gap-8 md:gap-12 ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  <div className="relative h-64 w-full flex-1 overflow-hidden shadow-md md:h-80">
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-sm font-semibold text-[#012D26]/60">{service.number}</span>
                    <h3 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-gray-600">{service.description}</p>
                    <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-gray-700 sm:grid-cols-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center justify-center gap-2 md:justify-start"
                        >
                          <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[#012D26]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-24">
              <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">
                Also Available
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {SUPPORTING_SERVICES.map(({ id, title, description }) => {
                  const Icon = SUPPORTING_ICONS[title];
                  return (
                    <div
                      id={id}
                      key={id}
                      className="rounded-xl border border-gray-200 p-6 transition-colors duration-300 hover:border-[#012D26]/30"
                    >
                      <Icon size={22} className="text-[#012D26]" />
                      <h4 className="mt-3 text-base font-bold text-gray-900">{title}</h4>
                      <p className="mt-2 text-sm text-gray-600">{description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          className="bg-gray-50 px-4 py-12 sm:px-6"
          aria-label="Book photography and videography services"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl shadow-md md:flex-row md:min-h-[420px]">
            <div className="relative aspect-[4/5] w-full shrink-0 bg-neutral-300 sm:aspect-[3/4] md:aspect-auto md:w-[42%] md:min-h-[420px]">
              <Image
                src="/family.jpg"
                alt="Book wedding, portrait, and event photography with Uncle Westiee Studios"
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 480px"
                priority={false}
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center bg-gray-900 px-6 py-12 text-center text-white sm:px-10 sm:py-14">
              <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                Ready to Capture Your Vision?
              </h2>
              <p className="mx-auto mt-4 mb-8 max-w-md text-sm text-white/85 sm:text-base md:text-lg">
                Browse our packages or contact us for a custom quote on your next project.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/packages"
                  className="inline-block rounded-lg bg-white py-2.5 px-6 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-gray-100 sm:py-3 sm:px-8 sm:text-base"
                >
                  View Packages
                </Link>
                <Link
                  href="/contact"
                  className="inline-block rounded-lg border-2 border-white py-2.5 px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-gray-900 sm:py-3 sm:px-8 sm:text-base"
                >
                  Get a Custom Quote
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
