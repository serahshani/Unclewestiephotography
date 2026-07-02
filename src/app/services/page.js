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
        heightClass="h-[50vh] min-h-[300px] sm:min-h-[380px] md:h-[600px] md:max-h-[80vh]"
        imagePosition="object-[center_25%]"
        imageBrightness="brightness-[.4]"
        priority
      />

      <main id="services-section">
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-24">
          <div className="container mx-auto max-w-5xl">
            <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16 md:mb-20">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#012D26]/70 sm:text-sm">
                Services
              </span>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                What We Offer
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#012D26] sm:mt-5" />
              <p className="mt-4 text-base text-gray-600 sm:mt-5 sm:text-lg">
                Professional photography and videography for weddings, events, portraits, and
                brands — tailored to the moment you&apos;re trying to capture.{' '}
                <Link href="/portfolio" className="font-medium text-[#012D26] hover:underline">
                  View our portfolio
                </Link>
                .
              </p>
            </div>

            <div className="space-y-12 sm:space-y-16 md:space-y-24">
              {FEATURED_SERVICES.map((service, index) => (
                <article
                  id={service.id}
                  key={service.id}
                  className={`flex flex-col items-stretch gap-6 sm:gap-8 md:gap-12 ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full min-h-[220px] overflow-hidden shadow-md sm:min-h-[260px] md:aspect-auto md:h-80 md:min-h-0 md:flex-1">
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="w-full flex-1 text-center md:text-left">
                    <span className="text-sm font-semibold text-[#012D26]/60">{service.number}</span>
                    <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 sm:mt-4 sm:text-base">
                      {service.description}
                    </p>
                    <ul className="mt-5 grid grid-cols-1 gap-y-2 text-sm text-gray-700 sm:mt-6 md:grid-cols-2 md:gap-x-6">
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

            <div className="mt-16 sm:mt-20 md:mt-24">
              <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-gray-400 sm:mb-6 sm:text-sm">
                Also Available
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {SUPPORTING_SERVICES.map(({ id, title, description }) => {
                  const Icon = SUPPORTING_ICONS[title];
                  return (
                    <div
                      id={id}
                      key={id}
                      className="rounded-xl border border-gray-200 p-5 sm:p-6 transition-colors duration-300 hover:border-[#012D26]/30"
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
          className="bg-gray-50 px-4 py-10 sm:px-6 sm:py-12"
          aria-label="Book photography and videography services"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl shadow-md sm:rounded-3xl md:min-h-[420px] md:flex-row">
            <div className="relative aspect-[3/4] w-full min-h-[280px] max-h-[min(85vw,420px)] shrink-0 bg-neutral-300 sm:min-h-[320px] md:aspect-auto md:max-h-none md:min-h-[420px] md:w-[42%]">
              <Image
                src="/family.jpg"
                alt="Book wedding, portrait, and event photography with Uncle Westiee Studios"
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
            <div className="flex w-full flex-1 flex-col items-center justify-center bg-gray-900 px-5 py-10 text-center text-white sm:px-8 sm:py-12 md:px-10 md:py-14">
              <h2 className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">
                Ready to Capture Your Vision?
              </h2>
              <p className="mx-auto mt-3 mb-7 max-w-md text-sm text-white/85 sm:mt-4 sm:mb-8 sm:text-base md:text-lg">
                Browse our packages or contact us for a custom quote on your next project.
              </p>
              <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:gap-4">
                <Link
                  href="/packages"
                  className="inline-block w-full rounded-lg bg-white py-3 px-6 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-gray-100 sm:w-auto sm:py-3 sm:px-8 sm:text-base"
                >
                  View Packages
                </Link>
                <Link
                  href="/contact"
                  className="inline-block w-full rounded-lg border-2 border-white py-3 px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-gray-900 sm:w-auto sm:py-3 sm:px-8 sm:text-base"
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
