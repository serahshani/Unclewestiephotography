import Navbar from '../Components/navbar';
import Footer from '../Components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Heart, Briefcase, Film, Users, Sparkles, Satellite } from 'lucide-react'; // Added Drone icon

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section: Our Services */}
      <section className="relative w-full h-[600px] flex items-center justify-center text-white overflow-hidden pt-50">
        <Image
          src="/Servicespagehero.jpg" // Replace with a compelling image representing your services
          alt="Diverse Studios Services"
          fill={true}
          className="object-cover object-center brightness-[.4]"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 text-center px-6 md:px-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg animate-fade-in-up">
            Tailored Studios & Videography Services
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto italic drop-shadow-md animate-fade-in-up delay-200">
            Your vision, beautifully captured. Explore our range of professional services.
          </p>
        </div>
      </section>

      {/* Services Overview Section (Target for Navbar link) */}
      <section id="services-section" className="py-20 px-6 bg-gradient-to-br from-gray-100 to-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-12 relative pb-6">
            <span className="relative z-10">What We Offer</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-green-600 rounded-full opacity-70"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Service Item 1: Wedding Studios */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 group">
              <div className="flex justify-center mb-6">
                <Heart size={48} className="text-green-600 group-hover:text-green-700 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Wedding Studios</h3>
              <p className="text-gray-700 mb-4 text-center">
                Capture the magic and emotion of your special day. From intimate ceremonies to grand celebrations, we ensure every precious moment is preserved beautifully.
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm mb-6 space-y-1">
                <li>Full-day coverage</li>
                <li>Engagement shoots</li>
                <li>High-resolution digital gallery</li>
                <li>Custom album design available</li>
              </ul>
              {/* Image removed */}
            </div>

            {/* Service Item 2: Portrait Studios */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 group">
              <div className="flex justify-center mb-6">
                <Users size={48} className="text-green-600 group-hover:text-green-700 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Portrait Sessions</h3>
              <p className="text-gray-700 mb-4 text-center">
                From striking headshots to heartwarming family portraits, we capture your unique personality and connections in stunning detail.
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm mb-6 space-y-1">
                <li>Individual & Family portraits</li>
                <li>Maternity & Newborn shoots</li>
                <li>Professional Headshots</li>
                <li>On-location or studio options</li>
              </ul>
              {/* Image removed */}
            </div>

            {/* Service Item 3: Event Studios */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 group">
              <div className="flex justify-center mb-6">
                <Film size={48} className="text-green-600 group-hover:text-green-700 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Event Coverage</h3>
              <p className="text-gray-700 mb-4 text-center">
                Ensure every moment of your corporate event, celebration, or public gathering is documented with dynamic and professional imagery.
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm mb-6 space-y-1">
                <li>Corporate events & conferences</li>
                <li>Birthday parties & anniversaries</li>
                <li>Concerts & festivals</li>
                <li>Candid and posed shots</li>
              </ul>
              {/* Image removed */}
            </div>

            {/* Service Item 4: Commercial & Product Studios */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 group">
              <div className="flex justify-center mb-6">
                <Briefcase size={48} className="text-green-600 group-hover:text-green-700 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Commercial & Product</h3>
              <p className="text-gray-700 mb-4 text-center">
                Elevate your brand with captivating commercial imagery and crisp, professional product Studios that drives sales.
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm mb-6 space-y-1">
                <li>Product Studios for e-commerce</li>
                <li>Brand storytelling imagery</li>
                <li>Real estate Studios</li>
                <li>Customized shoots for marketing</li>
              </ul>
              {/* Image removed */}
            </div>

            {/* Service Item 5: Professional Videography */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 group">
              <div className="flex justify-center mb-6">
                <Camera size={48} className="text-green-600 group-hover:text-green-700 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Professional Videography</h3>
              <p className="text-gray-700 mb-4 text-center">
                Beyond still images, we craft engaging video content for events, businesses, and personal stories, bringing your moments to life.
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm mb-6 space-y-1">
                <li>Event highlight reels</li>
                <li>Brand promotional videos</li>
                <li>Interview style videos</li>
                <li>Custom cinematic productions</li>
              </ul>
              {/* Image removed */}
            </div>

            {/* Service Item 6: Drone Services (New) */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 group">
              <div className="flex justify-center mb-6">
                <Satellite size={48} className="text-green-600 group-hover:text-green-700 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Drone Services</h3>
              <p className="text-gray-700 mb-4 text-center">
                Elevate your visuals with breathtaking aerial perspectives. Perfect for landscapes, real estate, events, and unique cinematic shots.
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm mb-6 space-y-1">
                <li>Aerial photography & videography</li>
                <li>Real estate & property surveys</li>
                <li>Event aerial coverage</li>
                <li>Landscape & tourism visuals</li>
              </ul>
              {/* Image removed */}
            </div>

            {/* Service Item 7: Expert Retouching & Editing (Optional - moved to maintain grid structure) */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 group">
              <div className="flex justify-center mb-6">
                <Sparkles size={48} className="text-green-600 group-hover:text-green-700 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Expert Retouching & Editing</h3>
              <p className="text-gray-700 mb-4 text-center">
                Beyond the shoot, our meticulous post-production process ensures every image is polished to perfection, enhancing its natural beauty.
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm mb-6 space-y-1">
                <li>Color correction & grading</li>
                <li>Skin retouching & blemish removal</li>
                <li>Object removal/addition</li>
                <li>Creative composites</li>
              </ul>
              {/* Image removed */}
            </div>

          </div> {/* End of grid */}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-900 text-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to Capture Your Vision?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Browse our tailored packages or contact us for a custom quote on your next project.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/packages"
              className="bg-white text-green-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
            >
              View Packages
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-white hover:text-green-900 transition-all duration-300 transform hover:scale-105"
            >
              Get a Custom Quote
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}