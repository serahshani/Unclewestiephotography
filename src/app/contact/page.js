import Navbar from '../Components/navbar';
import Image from 'next/image'; // For potential icons or background images
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaTiktok } from 'react-icons/fa'; // Example icons
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'; // Social media icons

export default function ContactPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section for Contact */}
      <section className="relative w-full h-96 flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/Hero3.jpg" // Replace with your actual hero image path in /public
          alt="Contact Us Background"
          fill={true}
          className="object-cover object-center brightness-50" // Dim the image for text readability
          priority
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4 animate-fade-in-up">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto italic animate-fade-in-up delay-200">
            We would love to hear from you. Reach out to discuss your Studios needs!
          </p>
        </div>
      </section>

      {/* Main Contact Content Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="container mx-auto max-w-5xl">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Information</h2>
              <div className="space-y-6 text-lg text-gray-700">
                <div className="flex items-center space-x-4">
                  <FaPhone className="text-[#012D26] text-2xl" />
                  <span>+254791264173</span> {/* Your phone number */}
                </div>
                <div className="flex items-center space-x-4">
                  <FaWhatsapp className="text-[#012D26] text-2xl" />
                  <span>+254791264173</span> {/* Your WhatsApp number */}
                </div>
                <div className="flex items-center space-x-4">
                  <FaEnvelope className="text-[#012D26] text-2xl" />
                  <span>info@unclewestiee.com</span> {/* Your email */}
                </div>
                {/* --- Two Locations Separated --- */}
                <div className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="text-[#012D26] text-2xl mt-1" />
                  <span>
                    Main branch: Nairobi, Kenya
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="text-[#012D26] text-2xl mt-1" />
                  <span>
                   Other branches: Maralal, Samburu, Kenya
                  </span>
                </div>
                {/* ----------------------------- */}
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-[#012D26] mb-4">Follow Us</h3>
                <div className="flex justify-center space-x-6">
                  <a href="https://www.instagram.com/uncle_westiee_studios/?hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                    <FaInstagram size={36} />
                  </a>
                  <a href="https://www.facebook.com/p/Uncle_westiee-photography-100076434076242/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                    <FaFacebook size={36} />
                  </a>
                  {/* Add more social media links as needed */}
                  <a href="https://www.youtube.com/channel/UCaPJSHbeHHA5Wft0ywekl-A" target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-red-600 transition-colors duration-300'>
                     <FaYoutube size={36}/>
                  </a>
                  <a href="https://www.tiktok.com/@uncle_westiee?lang=en" target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-black transition-colors duration-300'>
                     <FaTiktok size={36}/>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Send Us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Wedding Inquiry, Portrait Session"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tell us about your project or question..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#012D26] text-white font-bold py-3 px-6 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Map Section (Optional) */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Find Us on the Map</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* This map embed is for Ruiru, Kiambu. Consider adding a second map or a combined one for Maralal if desired. */}
              <iframe
                src="https://maps.app.goo.gl/f16PpTcq9YnYcCaPA" // Example for Ruiru, Kenya - Update with actual embed code
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}