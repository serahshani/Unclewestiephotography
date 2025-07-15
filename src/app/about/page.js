import Navbar from '../Components/navbar';
import Footer from '../Components/footer'; // Assuming you have a Footer component
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section: Our Passion */}
      <section className="relative w-full h-[60vh] flex items-center justify-center text-white overflow-hidden pt-20">
        <Image
          src="/Gallery6.jpg" // Replace with your compelling About Us hero image
          alt="Uncle Westiee Studios Team at Work"
          fill={true}
          className="object-cover object-center brightness-[.5]" // Slightly dimmed for text readability
          priority
          sizes="100vw"
        />
        <div className="relative z-10 text-center px-6 md:px-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg animate-fade-in-up">
            Capturing Moments, Crafting Memories
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto italic drop-shadow-md animate-fade-in-up delay-200">
            More than just photos, we tell your unique story through the art of light and emotion.
          </p>
        </div>
      </section>

      {/* About Our Story Section (Target for Navbar link) */}
      <section id="about-section" className="py-20 px-6 bg-gradient-to-br from-gray-100 to-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-12 relative pb-6">
            <span className="relative z-10">Our Journey & Philosophy</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-green-600 rounded-full opacity-70"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-lg text-gray-700 space-y-6">
              <p>
                Welcome to Uncle Westiee Studios, where every click is driven by a profound passion for storytelling. Founded by GOEFREY MUNGAI, our studio has grown from a simple love for the lens into a dedicated team committed to preserving lifes most precious moments in Nairobi, and beyond.
              </p>
              <p>
                Our philosophy is simple: **Studios is not just about taking pictures; it is about capturing emotions, telling a narrative, and creating timeless art.** We believe that every individual, family, and event holds a unique story waiting to be beautifully told.
              </p>
              <p>
                We specialize in blending candid moments with beautifully posed shots, ensuring your true essence shines through. Our approach is collaborative and personal, focusing on understanding your vision to deliver results that exceed expectations.
              </p>
              <p>
                From the joyous chaos of a wedding day to the intimate expressions of a portrait session, we approach each project with creativity, professionalism, and a genuine desire to create memories you will cherish for generations.
              </p>
            </div>
            <div className="relative w-full h-80 md:h-[500px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/Westiee-about.jpeg" // Replace with an image of you/your team/studio
                alt="Uncle Westiee Studios Team"
                fill={true}
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12 relative pb-6">
            <span className="relative z-10">Our Core Values</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-green-600 rounded-full opacity-70"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Passion & Creativity</h3>
              <p className="text-gray-700">
                We bring boundless enthusiasm and innovative ideas to every shoot, ensuring your photos are unique and truly reflect your personality.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Professionalism & Reliability</h3>
              <p className="text-gray-700">
                From initial consultation to final delivery, we guarantee a seamless experience with timely communication and exceptional service.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Client-Centric Approach</h3>
              <p className="text-gray-700">
                Your vision is our priority. We listen, adapt, and work closely with you to bring your photographic dreams to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-900 text-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Something Beautiful?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Explore our portfolio, services, or get in touch for a personalized consultation.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/portfolio"
              className="bg-white text-green-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
            >
              View Portfolio
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-white hover:text-green-900 transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}