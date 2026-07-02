import Image from 'next/image';
import Link from 'next/link';

const HIGHLIGHTS = [
  {
    image: '/Gallery2.jpg',
    alt: 'Landscape photography in Samburu, Kenya',
    label: 'Scenic locations',
    text: 'From Samburu sunsets to Nairobi cityscapes — we find the light.',
  },
  {
    image: '/couple.jpg',
    alt: 'Couple portrait session in Kenya',
    label: 'Every story',
    text: 'Weddings, couples, families, and solo portraits — told your way.',
  },
  {
    image: '/Packages.jpg',
    alt: 'Wedding photography by Uncle Westiee Studios',
    label: 'Full-day coverage',
    text: 'Candid moments and posed portraits, seamlessly woven together.',
  },
  {
    image: '/family.jpg',
    alt: 'Family photography session in Kenya',
    label: 'Personal touch',
    text: 'One team, one vision — from first call to final gallery delivery.',
  },
];

export default function ServicesPage() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#012D26]/70 sm:text-sm">
            Based in Samburu, Kenya
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-gray-900 sm:text-4xl md:text-5xl">
            Destination photography for moments that matter
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
            Uncle Westiee Studios captures weddings, portraits, and events across Nairobi,
            Samburu, Maralal, and nationwide — with an eye for emotion and a respect for your
            story.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-block text-sm font-semibold text-[#012D26] underline underline-offset-4 hover:text-[#014a3d]"
          >
            See all services
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5">
          {HIGHLIGHTS.map((item) => (
            <figure key={item.label} className="group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#012D26]/80">
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
