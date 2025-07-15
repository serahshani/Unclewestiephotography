
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>

      {/* Personal Bio Section */}
      <section id="about" className="py-16 px-4 bg-white">
        <h1 className="text-4xl font-serif text-center text-[#012D26] mb-12">About me</h1>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:space-x-12">
          {/* Photo */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/Westiee-about.jpeg"  // ← replace with your actual image path
              alt="Westiee Studios"
              width={600}
              height={800}
              className="rounded-lg object-cover"
            />
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 text-black space-y-6">
            <p>
              Welcome to my world of Studios! My name is Uncle Westiee, I’m a passionate
              photographer based in Nairobi, Nairobi County, Kenya. With a keen eye for detail and a love for capturing
              life’s most precious moments, I specialize in wedding, portrait, and
              fashion Studios.
            </p>
            <p>
              My journey has taken me across the globe, but Nairobi’s enchanting
              sunsets and stunning vistas have become my muse. As a destination
              photographer, I am thrilled to offer my services not only here in
              Nairobi but worldwide, creating timeless memories wherever your
              story unfolds.
            </p>
            <p>
              On this page, you’ll find a variety of Studios packages tailored
              to your needs, including solo portraits, couple sessions,
              engagements, weddings, and family photoshoots. I am dedicated to
              capturing your unique story with creativity and professionalism.
            </p>
            <p>Let’s create beautiful memories together, one snapshot at a time!</p>
          </div>
        </div>
      </section>
    </>
  );
}
