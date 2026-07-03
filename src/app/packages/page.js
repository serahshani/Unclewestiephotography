import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { FaChevronDown } from 'react-icons/fa';
import PageHero from '@/components/layout/PageHero';
import { STUDIO_PACKAGES } from '@/lib/packages-data';
import { PACKAGES_FAQ_ITEMS } from '@/lib/packages-faq';
import { PACKAGES_BREADCRUMBS } from '@/lib/page-breadcrumbs';
import { CONTACT } from '@/lib/site-config';

function whatsappHref(message) {
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export default function PackagesPage() {
  return (
    <>
      <PageHero
        image="/Packages.jpg"
        imageAlt="Photography and videography packages by Uncle Westiee Studios in Kenya"
        title="Photography & Videography Packages"
        subtitle="Wedding, event, portrait, and commercial packages in Nairobi, Samburu, and across Kenya."
        breadcrumbs={PACKAGES_BREADCRUMBS}
        heightClass="h-[60vh] min-h-[400px]"
        imagePosition="object-[center_35%]"
        imageBrightness="brightness-[.4]"
        priority
      />

      <main id="packages-section">
      <section className="bg-white py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#012D26]/70">
              Pricing
            </span>
            <h2 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
              Choose Your Perfect Package
            </h2>
            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#012D26]" />
            <p className="mt-5 text-lg text-gray-600">
              Uncle Westiee Studios offers wedding, event, portrait, and commercial photography and
              videography across Kenya. Pick the scope that fits your occasion — then{' '}
              <Link href="/contact" className="font-medium text-[#012D26] hover:underline">
                contact us
              </Link>{' '}
              or{' '}
              <Link href="/portfolio" className="font-medium text-[#012D26] hover:underline">
                view our portfolio
              </Link>{' '}
              for recent work.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STUDIO_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                id={pkg.id}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#012D26]/30 hover:shadow-xl"
              >
                {/* Card header */}
                <div className="border-b border-gray-100 px-7 pb-6 pt-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Ideal for {pkg.idealFor}
                  </p>
                  <div className="mt-5">
                    {pkg.price ? (
                      <p className="text-4xl font-extrabold text-[#012D26]">{pkg.price}</p>
                    ) : (
                      <p className="text-2xl font-bold text-gray-700">Inquire for Pricing</p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-1 flex-col justify-between px-7 pb-8 pt-6">
                  <ul className="mb-8 space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                        <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-[#012D26]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={whatsappHref(pkg.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto block rounded-lg bg-[#012D26] py-3 px-6 text-center text-sm font-bold text-white transition-all duration-300 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                  >
                    {pkg.buttonText}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="packages-faq"
        aria-labelledby="packages-faq-heading"
        className="border-t border-gray-100 bg-[#faf9f7] py-16 px-6"
      >
        <div className="container mx-auto max-w-3xl">
          <h2 id="packages-faq-heading" className="font-serif text-2xl font-medium text-[#012D26] sm:text-3xl">
            Package questions
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Quick answers on pricing, booking, and what is included.
          </p>
          <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200 bg-white">
            {PACKAGES_FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group px-5 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-[#012D26] [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <FaChevronDown
                    className="shrink-0 text-xs text-[#012D26]/50 transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-white px-4 py-12 sm:px-6"
        aria-label="Request a custom photography quote"
      >
        <div className="relative mx-auto min-h-[300px] w-full max-w-7xl overflow-hidden rounded-3xl text-center text-white sm:min-h-[360px]">
          <Image
            src="/Gallery5.jpg"
            alt="Custom photography and videography quote background"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/25"
            aria-hidden
          />
          <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center px-6 py-14 sm:min-h-[360px]">
            <h2 className="text-3xl font-bold drop-shadow-md md:text-4xl">Need Something More Custom?</h2>
            <p className="mx-auto mt-5 mb-9 max-w-2xl text-lg text-white/90 drop-shadow-sm">
              If our standard packages don&apos;t quite fit your vision, we&apos;re happy to create
              a personalized quote just for you.
            </p>
            <Link
              href={whatsappHref('Hello! I would like to request a custom quote for your services.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-white py-3 px-8 font-bold text-[#012D26] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
            >
              Request a Custom Quote
            </Link>
            <p className="mt-6 text-sm text-white/80">
              Prefer email?{' '}
              <Link href="/contact" className="underline underline-offset-4 hover:text-white">
                Go to the contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}