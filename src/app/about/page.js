import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import { ABOUT_BREADCRUMBS } from '@/lib/page-breadcrumbs';

const VALUES = [
  {
    icon: Sparkles,
    title: 'Passion & Creativity',
    description:
      'We bring boundless enthusiasm and innovative ideas to every shoot, ensuring your photos are unique and truly reflect your personality.',
  },
  {
    icon: ShieldCheck,
    title: 'Professionalism & Reliability',
    description:
      'From initial consultation to final delivery, we guarantee a seamless experience with timely communication and exceptional service.',
  },
  {
    icon: HeartHandshake,
    title: 'Client-Centric Approach',
    description:
      'Your vision is our priority. We listen, adapt, and work closely with you to bring your photographic dreams to life.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/Gallery6.jpg"
        imageAlt="Uncle Westiee Studios photography and videography team in Kenya"
        title="Capturing Moments, Crafting Memories"
        subtitle="More than photos — we tell your story through light, emotion, and authentic Kenyan moments."
        breadcrumbs={ABOUT_BREADCRUMBS}
        heightClass="h-[50vh] min-h-[300px] sm:min-h-[380px] md:h-[60vh] md:min-h-[400px]"
        imagePosition="object-[center_20%]"
        imageBrightness="brightness-[.5]"
        priority
      />

      <main id="about-section">
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
              <div className="order-2 md:order-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#012D26]/70 sm:text-sm">
                  Our Story
                </span>
                <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                  Our Journey & Philosophy
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-[#012D26] sm:mt-5" />
                <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-700 sm:mt-8 sm:space-y-5 sm:text-lg">
                  <p>
                    Welcome to Uncle Westiee Studios, where every click is driven by a profound
                    passion for storytelling. Our studio has grown from a simple love for the lens
                    into a dedicated team committed to preserving life&apos;s most precious moments
                    in Nairobi and across Kenya.
                  </p>
                  <p>
                    <span className="font-bold text-gray-900">
                      Photography is not just about taking pictures; it is about capturing emotions,
                      telling a narrative, and creating timeless art.
                    </span>{' '}
                    We believe that every individual, family, and event holds a unique story waiting
                    to be beautifully told.
                  </p>
                  <p>
                    We specialize in blending candid moments with beautifully posed shots, ensuring
                    your true essence shines through. Our approach is collaborative and personal,
                    focusing on understanding your vision to deliver results that exceed
                    expectations.
                  </p>
                  <p>
                    From the joyous chaos of a wedding day to the intimate expressions of a portrait
                    session, we approach each project with creativity, professionalism, and a genuine
                    desire to create memories you will cherish for generations.{' '}
                    <Link href="/services" className="font-medium text-[#012D26] hover:underline">
                      Explore our services
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <div className="relative order-1 aspect-[4/3] w-full min-h-[240px] overflow-hidden shadow-lg sm:min-h-[280px] md:order-2 md:aspect-auto md:h-[500px] md:min-h-0">
                <Image
                  src="/Westiee-about.jpeg"
                  alt="Uncle Westiee Studios team — wedding and portrait photographers in Kenya"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 md:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#012D26]/70 sm:text-sm">
                What Drives Us
              </span>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                Our Core Values
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#012D26] sm:mt-5" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#012D26]/30 hover:shadow-xl sm:p-8"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#012D26]/10 transition-colors duration-300 group-hover:bg-[#012D26]/15 sm:mb-6">
                    <Icon size={26} className="text-[#012D26]" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
                  <p className="text-sm text-gray-600 sm:text-base">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="bg-white px-4 py-10 sm:px-6 sm:py-12"
          aria-label="View portfolio or contact Uncle Westiee Studios"
        >
          <div className="relative mx-auto min-h-[300px] w-full max-w-6xl overflow-hidden rounded-2xl text-center text-white shadow-md sm:min-h-[360px] sm:rounded-3xl">
            <Image
              src="/solo.jpg"
              alt="Portrait photography by Uncle Westiee Studios in Kenya"
              fill
              className="object-cover object-[center_35%]"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25"
              aria-hidden
            />
            <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center px-5 py-12 sm:min-h-[360px] sm:px-8 sm:py-14">
              <h2 className="text-xl font-bold drop-shadow-md sm:text-2xl md:text-3xl lg:text-4xl">
                Ready to Create Something Beautiful?
              </h2>
              <p className="mx-auto mt-3 mb-7 max-w-md text-sm text-white/90 drop-shadow-sm sm:mt-4 sm:mb-8 sm:max-w-xl sm:text-base md:text-lg">
                Explore our portfolio, browse services, or get in touch for a personalized
                consultation.
              </p>
              <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:gap-4">
                <Link
                  href="/portfolio"
                  className="inline-block w-full rounded-lg bg-white py-3 px-6 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-gray-100 sm:w-auto sm:py-3 sm:px-8 sm:text-base"
                >
                  View Portfolio
                </Link>
                <Link
                  href="/contact"
                  className="inline-block w-full rounded-lg border-2 border-white py-3 px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-gray-900 sm:w-auto sm:py-3 sm:px-8 sm:text-base"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
