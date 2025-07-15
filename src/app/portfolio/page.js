import Navbar from '../Components/navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function PortfolioPage() {
  // Sample data for your images
  const images = [
    { src: '/Hero1.png', alt: 'Wedding Studios' },
    { src: '/Gallery1.jpg', alt: 'Portrait Session' },
    { src: '/Gallery2.jpg', alt: 'Landscape View' },
    { src: '/Gallery3.jpg', alt: 'Fashion Shoot' },
    { src: '/Gallery4.jpg', alt: 'Event Coverage' },
    { src: '/Gallery5.jpg', alt: 'Wildlife Capture' },
    { src: '/Hero2.jpg', alt: 'Nature Beauty' },
    { src: '/Hero3.jpg', alt: 'Urban Exploration' },
  ];

  // YouTube video URLs and titles
  const youtubeVideos = [
    {
      // You'll need to get the real video ID from the YouTube URL (e.g., from watch?v=THIS_IS_THE_ID)
      // For demonstration, I'm using placeholder IDs for now, which you MUST replace.
      url: 'https://www.youtube.com/watch?v=axuNuWaIToE', // Example: SAINAPNAP BY LENAMBA
      title: 'SAINAPNAP BY LENAMBA',
      videoId: 'axuNuWaIToE', // **REPLACE WITH THE ACTUAL VIDEO ID**
    },
    {
      url: 'https://www.youtube.com/watch?v=QWUz8hmrtJU', // Example: THE SUNSET AT LOSUK TOWN - Nairobi
      title: 'THE SUNSET AT LOSUK TOWN - Nairobi',
      videoId: 'QWUz8hmrtJU', // **REPLACE WITH THE ACTUAL VIDEO ID**
    },
    {
      url: 'https://www.youtube.com/watch?v=yFrNnazQep8', // Example: UTARO PERFORMANCE BY SANINGO DIMERO
      title: 'PAPA MAASAI PERFORMANCE AT PILONJE MEGA LAUNCH AT KENYATTA STADIUM MARALAL',
      videoId: 'yFrNnazQep8', // **REPLACE WITH THE ACTUAL VIDEO ID**
    },
    {
      url: 'https://www.youtube.com/watch?v=jv5gAGERo68', // Example: SUPATI LANYASUNYA WEDS DOMINIC LESINGIRAN
      title: 'SAMBURU GOVERNORS CUP 2025 PREPARATION',
      videoId: 'jv5gAGERo68', // **REPLACE WITH THE ACTUAL VIDEO ID**
    },
  ];

  // Function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId) => {
    // This generates the correct thumbnail URL format
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen pt-24 pb-16 bg-gradient-to-br bg-white from-gray-50 to-gray-100">
        <div className="container mx-auto px-6 lg:px-10">
          <h1 className="text-6xl font-extrabold text-center text-[#012D26] mb-6 mt-10 leading-tight">
            Our Visual Journey
          </h1>
          <p className="max-w-4xl mx-auto text-center text-xl text-gray-700 mb-20 italic">
            Every click tells a story. Explore our curated collection of moments, captured through the lens and brought to life through light and emotion.
          </p>

          {/* Studios Gallery Section */}
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#012D26] mb-16 relative pb-6">
            <span className="relative z-10">Studios Gallery</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-[#012D26] rounded-full opacity-70"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-24">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-full overflow-hidden group aspect-w-1 aspect-h-1 rounded-md shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                style={{ paddingTop: '100%' }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill={true}
                  className="object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 4}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-start p-4 transition-opacity duration-300">
                  <p className="text-white text-lg font-semibold tracking-wide capitalize group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider between sections */}
          <div className="w-full max-w-2xl mx-auto h-0.5 bg-gray-300 my-20"></div>

          {/* Video Showcase Section (Clickable Links with Thumbnails) */}
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#012D26] mb-16 relative pb-6">
            <span className="relative z-10">Cinematic Stories</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-[#012D26] rounded-full opacity-70"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
            {youtubeVideos.map((video, index) => (
              <div
                key={index}
                className="relative w-full overflow-hidden rounded-md shadow-lg group transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <Link
                  // Ensure this href is the actual YouTube watch URL
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div
                    className="relative"
                    style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
                  >
                    <Image
                      src={getYouTubeThumbnail(video.videoId)}
                      alt={`Thumbnail for ${video.title}`}
                      fill={true}
                      className="object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-16 h-16 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-lg font-semibold text-gray-800 group-hover:text-[#012D26] transition-colors duration-300">
                      {video.title}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}