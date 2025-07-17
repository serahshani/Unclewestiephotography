import Navbar from '../Components/navbar';
import Footer from '../Components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react'; // Icon for features

const PHONE_NUMBER = '+254791264173'; // Your WhatsApp number (no "+", no spaces)
const WHATSAPP_BASE = `https://wa.me/${PHONE_NUMBER}`;

export default function PackagesPage() {
  const packages = [
    {
      name: 'Essential Portrait',
      features: [
        '1-hour photo session',
        '1 location (studio or outdoor)',
        '2 outfit changes',
        '20 high-resolution edited photos',
        'Online gallery for 1 month',
      ],
      idealFor: 'Individuals, professional headshots, simple family portraits.',
      // No explicit price here, as it's assumed to be part of the WhatsApp inquiry
      buttonText: 'Book Essential',
      whatsappMessage: 'Hello! I would like to book the Essential Portrait package.',
    },
    {
      name: 'Premium Event',
      features: [
        '4 hours of coverage',
        '2 photographers',
        '150 high-resolution edited photos',
        'Online gallery for 3 months',
        'Basic video highlights (3-5 min)', // Example feature
      ],
      idealFor: 'Birthday parties, anniversaries, corporate gatherings.',
      buttonText: 'Book Premium',
      whatsappMessage: 'Hello! I would like to book the Premium Event package.',
    },
    {
      name: 'Luxury Wedding',
      features: [
        'Full-day coverage (up to 10 hours)',
        '2 lead photographers',
        '400+ high-resolution edited photos',
        'Custom engraved wooden USB drive',
        'Elegant wedding album',
        'Cinematic wedding video (20-30 min)',
      ],
      idealFor: 'Couples seeking comprehensive, premium wedding Studios.',
      buttonText: 'Book Luxury',
      whatsappMessage: 'Hello! I would like to book the Luxury Wedding package.',
    },
    {
      name: 'Commercial Starter',
      price: 'Custom Quote', // Example pricing
      features: [
        'Half-day shoot (up to 4 hours)',
        'Product/Service focused imagery',
        '50 high-resolution commercial-use images',
        'Basic usage license',
      ],
      idealFor: 'Small businesses, e-commerce product listings, brand content.',
      buttonText: 'Request Quote',
      whatsappMessage: 'Hello! I would like to inquire about the Commercial Starter package.',
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section: Our Packages */}
      <section className="relative w-full h-[60vh] flex items-center justify-center text-white overflow-hidden pt-20">
        <Image
          src="/Packages.jpg" // Replace with an image representing value/offerings
          alt="Studios Pricing Packages"
          fill={true}
          className="object-cover object-center brightness-[.4]"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 text-center px-6 md:px-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg animate-fade-in-up">
            Transparent Studios Packages
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto italic drop-shadow-md animate-fade-in-up delay-200">
            Exceptional quality, designed for every budget and occasion.
          </p>
        </div>
      </section>

      {/* Packages Overview Section (Target for Navbar link) */}
      <section id="packages-section" className="py-20 px-6 bg-gradient-to-br from-gray-100 to-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-12 relative pb-6">
            <span className="relative z-10">Choose Your Perfect Package</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-[#012D26] rounded-full opacity-70"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {packages.map((pkg, index) => {
              // Construct WhatsApp link for each package
              const whatsappLink = `${WHATSAPP_BASE}?text=${encodeURIComponent(pkg.whatsappMessage)}`;

              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg flex flex-col justify-between
                             border-t-4 border-[#012D26] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">{pkg.name}</h3>
                    {/* Display price if available, otherwise indicate inquiry */}
                    {pkg.price ? (
                      <p className="text-4xl font-extrabold text-[#012D26] mb-6 text-center">
                        {pkg.price}
                      </p>
                    ) : (
                      <p className="text-2xl font-bold text-gray-700 mb-6 text-center">
                        Inquire for Pricing
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-6 italic text-center">
                      Ideal for: {pkg.idealFor}
                    </p>
                    <ul className="space-y-3 mb-8 text-gray-700">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-md">
                          <CheckCircle size={20} className="text-[#012D26] mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={whatsappLink} // Use the generated WhatsApp link
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice
                    className="block mt-auto bg-[#012D26] text-white font-bold py-3 px-6 rounded-lg text-center
                               hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                               transition-all duration-300 transform hover:scale-105"
                  >
                    {pkg.buttonText}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Quote Call to Action */}
      <section className="bg-[#012D26] text-white py-16 text-center mt-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Need Something More Custom?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            If our standard packages does not quite fit your vision, we are happy to create a personalized quote just for you.
          </p>
          <Link
            href={`${WHATSAPP_BASE}?text=${encodeURIComponent('Hello! I would like to request a custom quote for your services.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#012D26] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
          >
            Request a Custom Quote
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}