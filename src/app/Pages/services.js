import Image from 'next/image';

export default function ServicesPage() {
  return (
    <>
      {/* Scenic Serenity Feature Grid */}
      <section className="bg-gray-200 text-center py-20 px-6 sm:px-10"> {/* Increased vertical padding and horizontal padding */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#012D26] mb-6 leading-tight"> {/* Larger, bolder, and more prominent */}
          Destination photographer based in <span className="text-[#012D26]">Nairobi, Nairobi County, Kenya</span>.
        </h2>
        <p className="max-w-4xl mx-auto text-lg md:text-xl text-gray-800 mb-16 italic font-medium"> {/* Larger, italic, and slightly darker text */}
          "Experience the magic of <span className="font-semibold text-[#012D26]">Nairobi</span> as the perfect backdrop for your special
          moments with <span className="text-[#012D26] font-bold">Uncle Westiee Studios</span>. Whether it’s intimate couples’
          portraits, joyous family gatherings, or elegant fashion shoots, bespoke
          Studios packages are designed to meet your needs and exceed your
          expectations. From solo portraits to grand wedding celebrations, each
          photo tells your unique story."
        </p>

        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 relative"> {/* Larger, bold, and added relative for pseudo-element */}
          Capturing Moments, Creating Memories
          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-15px] h-1.5 w-24 bg-[#012D26] rounded-full"></span> {/* Simple underline effect */}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 max-w-7xl mx-auto"> {/* Adjusted gap and max-width for more breathing room */}
          {/* Scenic Serenity */}
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"> {/* Added padding, background, shadow, and hover effect */}
            <svg className="w-16 h-16 text-[#012D26] mb-6" fill="currentColor" viewBox="0 0 24 24"> {/* Larger icon */}
              <path d="M5 3a2 2 0 0 0-2 2v14l4-4h13a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z"/>
            </svg>
            <h4 className="font-extrabold text-lg tracking-wider uppercase text-gray-900 mb-2">Scenic Serenity</h4> {/* Larger and bolder title */}
            <p className="text-base text-gray-700 leading-relaxed">Perfect Locations Found for Every Shoot.</p> {/* Larger text with improved line height */}
          </div>
          {/* Memories Made Easy */}
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg className="w-16 h-16 text-[#012D26] mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h4l2-2h4l2 2h4a2 2 0 0 1 2 2v3H2V6a2 2 0 0 1 2-2zm-2 7h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9z"/>
            </svg>
            <h4 className="font-extrabold text-lg tracking-wider uppercase text-gray-900 mb-2">Memories Made Easy</h4>
            <p className="text-base text-gray-700 leading-relaxed">Effortless Studios Solutions for Your Special Day.</p>
          </div>
          {/* Personalized Service */}
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg className="w-16 h-16 text-[#012D26] mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 20h5v2h-5v-2zM2 2h20v2H2V2zm0 6h20v2H2V8zm0 6h20v2H2v-2z"/>
            </svg>
            <h4 className="font-extrabold text-lg tracking-wider uppercase text-gray-900 mb-2">Personalized Service</h4>
            <p className="text-base text-gray-700 leading-relaxed">
              Receive personalized attention and care throughout the entire Studios
              process, ensuring your vision is brought to life.
            </p>
          </div>
          {/* Make a Statement */}
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg className="w-16 h-16 text-[#012D26] mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 21 12 17.27 7.82 21 9 12.91 4 9.27l5.91-.91L12 2z"/>
            </svg>
            <h4 className="font-extrabold text-lg tracking-wider uppercase text-gray-900 mb-2">Make a Statement</h4>
            <p className="text-base text-gray-700 leading-relaxed">
              With fashion-forward imagery that elevates your personality or brand and captivates your audience.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}