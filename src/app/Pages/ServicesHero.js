import Image from 'next/image';
import Link from 'next/link';

export default function ServicesHero() {
  return (
    <section id="services" className="relative w-full h-[70vh] sm:h-screen md:h-[80vh] lg:h-[90vh] xl:h-screen min-h-[500px] max-h-[1200px]">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/Services-hero.jpg"        // ← put your bride image here in /public/images
          alt="Wedding Studios"
          fill
          // On mobile, center the object for better visibility. On larger screens, keep it right.
          className="object-cover object-center sm:object-right"
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto h-full flex flex-col justify-center px-6 md:px-4 text-white space-y-4 sm:space-y-6"> {/* Adjusted px and space-y */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-wide text-center sm:text-left"> {/* Added responsive text alignment */}
          WEDDING Studios
        </h2>
        <p className="max-w-2xl leading-relaxed text-center sm:text-left text-base sm:text-lg"> {/* Added responsive text size and alignment */}
          Ready to create unforgettable memories? Reach out to discuss your wedding day Studios. From the intimate preparations to the jubilant celebration, choose a package that suits your needs.
        </p>
        <p className="max-w-2xl leading-relaxed text-center sm:text-left text-base sm:text-lg"> {/* Added responsive text size and alignment */}
          As your dedicated wedding photographer, I specialize in capturing candid moments and orchestrating your special day Studios seamlessly. Let’s connect and make your dream wedding a reality!
        </p>
        <Link
          href="https://wa.me/+254791264173" // Make sure to use the full international format for WhatsApp
          className="inline-block bg-[#012D26] bg-opacity-100 hover:bg-opacity-90 px-8 py-3 rounded-full text-lg font-semibold self-center sm:self-start transition-all duration-300" // Adjusted padding, font-weight, and button alignment
        >
          Send enquiry
        </Link>
      </div>
    </section>
  );
}