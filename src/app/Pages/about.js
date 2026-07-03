import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <section id="about" className="bg-[#f8f7f4] px-4 py-14 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/5] w-full min-h-[320px] overflow-hidden sm:min-h-[380px] md:min-h-[480px]">
          <Image
            src="/Westiee-about.jpeg"
            alt="Uncle Westiee — wedding and portrait photographer in Kenya"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="text-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#012D26]/70 sm:text-sm">
            The photographer
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-gray-900 sm:text-4xl">
            Uncle Westiee
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-700 sm:text-base">
            <p>
              I&apos;m a photographer based in Samburu, Kenya — drawn to honest light, real
              emotion, and the quiet in-between moments that become your favourite memories.
            </p>
            <p>
              Weddings, portraits, fashion, and events have taken me from Nairobi to destinations
              across the country. Samburu&apos;s golden hour is still home, but your story can be
              told wherever it unfolds.
            </p>
            <p>
              Every session is collaborative: we plan together, shoot with intention, and deliver
              a gallery you&apos;ll want to return to for years.
            </p>
          </div>
          <Link
            href="/about"
            className="mt-8 inline-block border border-[#012D26] px-6 py-2.5 text-sm font-semibold text-[#012D26] transition-colors hover:bg-[#012D26] hover:text-white"
          >
            Read our full story
          </Link>
        </div>
      </div>
    </section>
  );
}
