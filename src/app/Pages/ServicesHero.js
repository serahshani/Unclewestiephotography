import Image from 'next/image';
import Link from 'next/link';

export default function ServicesHero() {
  return (
    <section id="services" className="relative w-full h-[200vh] max-h-[5000px]">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/Services-hero.jpg"        // ← put your bride image here in /public/images
          alt="Wedding Studios"
          fill
          className="object-cover object-right"
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto h-full flex flex-col justify-center px-4 text-white space-y-6">
        <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-wide">
          WEDDING Studios
        </h2>
        <p className="max-w-2xl leading-relaxed">
          Ready to create unforgettable memories? Reach out to discuss your wedding day Studios. From the intimate preparations to the jubilant celebration, choose a package that suits your needs.
        </p>
        <p className="max-w-2xl leading-relaxed">
          As your dedicated wedding photographer, I specialize in capturing candid moments and orchestrating your special day Studios seamlessly. Let’s connect and make your dream wedding a reality!
        </p>
        <Link
          href="https://wa.me/0791264173"
          className="inline-block bg-[#012D26] bg-opacity-100 hover:bg-opacity-90 px-6 max-w-60 py-6 rounded-full text-lg justify-center"
        >
          Send enquiry
        </Link>
      </div>
    </section>
  );
}
