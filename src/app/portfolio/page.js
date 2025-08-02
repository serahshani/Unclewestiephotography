"use client";

import Navbar from '../Components/navbar';
import Image from 'next/image';
import { useState } from 'react';
import LightboxModal from '../Components/LightboxModal';

export default function PortfolioPage() {
  const categories = [
    {
      id: 'all',
      name: 'All Media',
      media: [
        { type: 'image', src: '/Hero1.png', alt: 'Wedding Studios', category: 'weddings' },
        { type: 'image', src: '/Gallery1.jpg', alt: 'Portrait Session', category: 'portraits' },
        {
          type: 'video',
          videoId: 'axuNuWaIToE',
          title: 'SAINAPNAP BY LENAMBA',
          category: 'events',
          description: 'Based on the video transcript, this is a song titled "SAINAPNAP BY LENAMBA" from Uncle Westiee Studios.'
        },
        { type: 'image', src: '/Gallery2.jpg', alt: 'Landscape View', category: 'landscapes' },
        { type: 'image', src: '/Gallery3.jpg', alt: 'Fashion Shoot', category: 'fashion' },
        {
          type: 'video',
          videoId: 'QWUz8hmrtJU',
          title: 'THE SUNSET AT LOSUK TOWN - Nairobi',
          category: 'landscapes',
          description: 'This video captures a serene sunset in Losuk Town, Samburu, Kenya, showing a river and rolling hills with a golden-orange glow.'
        },
        { type: 'image', src: '/Gallery4.jpg', alt: 'Event Coverage', category: 'events' },
        { type: 'image', src: '/Gallery5.jpg', alt: 'Wildlife Capture', category: 'wildlife' },
        {
          type: 'video',
          videoId: 'yFrNnazQep8',
          title: 'PAPA MAASAI PERFORMANCE',
          category: 'events',
          description: 'This video captures a traditional Maasai dance performance at the Pilonje Mega Launch in Kenyatta Stadium, Maralal.'
        },
        { type: 'image', src: '/Hero2.jpg', alt: 'Nature Beauty', category: 'landscapes' },
        { type: 'image', src: '/Hero3.jpg', alt: 'Urban Exploration', category: 'urban' },
        {
          type: 'video',
          videoId: 'jv5gAGERo68',
          title: 'SAMBURU GOVERNORS CUP 2025 PREPARATION',
          category: 'events',
          description: 'This video provides an update on the preparations for the Samburu Governors Cup 2025, featuring interviews with local residents.'
        },
      ],
    },
    {
      id: 'weddings',
      name: 'Weddings',
      media: [
        { type: 'image', src: '/Hero1.png', alt: 'Wedding Studios' },
        {
          type: 'video',
          videoId: '31sWI0Fb8tY',
          title: 'MERINA LOLCHURAGI WEDS REUBEN LEITORE',
          description: 'This video records a traditional Samburu wedding ceremony, including the MC, cheers, and mentions of specific places.'
        },
        {
          type: 'video',
          videoId: 'DbccT3_tw8o',
          title: 'JAMILA WEDS JEREMIAH - A SAMBURU WEDDING',
          description: 'This video captures the traditional Samburu wedding of Jamila and Jeremiah in Nkejemuny Samburu, with performances by Lenarasha and Samsellah.'
        },
        {
          type: 'video',
          videoId: 'S0IX1sQ8zRo',
          title: 'FELISTER WEDS ATINGAE - A SAMBURU WEDDING',
          description: 'This video documents the traditional Samburu wedding of Felister and Atingae, featuring the arrival of the groom\'s family, speeches, and performances by Samsellah and Starcab.'
        },
        {
          type: 'video',
          videoId: 'iJzD2C_dO3E',
          title: 'DIANA WEDS NDECCAH - A SAMBURU WEDDING',
          description: 'This video documents the Samburu wedding of Diana and Ndeccah in Maralal, featuring performances by Fantez and Starca B.'
        },
      ],
    },
    {
      id: 'portraits',
      name: 'Portraits',
      media: [{ type: 'image', src: '/Gallery1.jpg', alt: 'Portrait Session' }],
    },
    {
      id: 'events',
      name: 'Events',
      media: [
        { type: 'image', src: '/Gallery4.jpg', alt: 'Event Coverage' },
        {
          type: 'video',
          videoId: 'axuNuWaIToE',
          title: 'SAINAPNAP BY LENAMBA',
          description: 'Based on the video transcript, this is a song titled "SAINAPNAP BY LENAMBA" from Uncle Westiee Studios.'
        },
        {
          type: 'video',
          videoId: 'yFrNnazQep8',
          title: 'PAPA MAASAI PERFORMANCE',
          description: 'This video captures a traditional Maasai dance performance at the Pilonje Mega Launch in Kenyatta Stadium, Maralal.'
        },
        {
          type: 'video',
          videoId: 'jv5gAGERo68',
          title: 'SAMBURU GOVERNORS CUP 2025 PREPARATION',
          description: 'This video provides an update on the preparations for the Samburu Governors Cup 2025, featuring interviews with local residents.'
        },
      ],
    },
    {
      id: 'landscapes',
      name: 'Landscapes',
      media: [
        { type: 'image', src: '/Gallery2.jpg', alt: 'Landscape View' },
        { type: 'image', src: '/Nature1.png', alt: 'Nature Beauty' },
        {
          type: 'video',
          videoId: 'QWUz8hmrtJU',
          title: 'THE SUNSET AT LOSUK TOWN - Nairobi',
          description: 'This video captures a serene sunset in Losuk Town, Samburu, Kenya, showing a river and rolling hills with a golden-orange glow.'
        },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const getYouTubeThumbnail = (videoId) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const filteredMedia = activeCategory === 'all'
    ? categories.find(cat => cat.id === 'all').media
    : categories.find(cat => cat.id === activeCategory)?.media || [];

  const openLightbox = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedMedia(null);
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen pt-24 pb-16 bg-gradient-to-br bg-white from-gray-50 to-gray-100">
        <div className="container mx-auto px-6 lg:px-10">
          <h1 className="text-6xl font-extrabold text-center text-[#012D26] mb-6 mt-10 leading-tight">
            Our Visual Journey
          </h1>
          <p className="max-w-4xl mx-auto text-center text-xl text-gray-700 mb-10 italic">
            Every click tells a story. Explore our curated collection of moments, captured through the lens and brought to life through light and emotion.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300
                  ${activeCategory === cat.id
                    ? 'bg-[#012D26] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#012D26] mb-16 relative pb-6">
            <span className="relative z-10">
              {categories.find(cat => cat.id === activeCategory)?.name || 'Gallery'}
            </span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-[#012D26] rounded-full opacity-70"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-24">
            {filteredMedia.length > 0 ? (
              filteredMedia.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => openLightbox(mediaItem)}
                  className="relative w-full overflow-hidden group aspect-w-1 aspect-h-1 rounded-md shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
                >
                  <div className="relative w-full h-full" style={{ paddingTop: '100%' }}>
                    {mediaItem.type === 'image' ? (
                      <>
                        <Image
                          src={mediaItem.src}
                          alt={mediaItem.alt}
                          fill={true}
                          className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 4}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-start p-4 transition-opacity duration-300">
                          <p className="text-white text-lg font-semibold tracking-wide capitalize group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                            {mediaItem.alt}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Image
                          src={getYouTubeThumbnail(mediaItem.videoId)}
                          alt={`Thumbnail for ${mediaItem.title}`}
                          fill={true}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg
                            className="w-16 h-16 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div className="p-4 bg-white absolute bottom-0 left-0 right-0">
                          <p className="text-lg font-semibold text-gray-800 group-hover:text-[#012D26] transition-colors duration-300">
                            {mediaItem.title}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {mediaItem.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600 text-xl">No media found for this category.</p>
            )}
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <LightboxModal media={selectedMedia} onClose={closeLightbox} />
      )}
    </>
  );
}

// Assuming LightboxModal.js looks something like this:
// "use client";

// import { motion } from 'framer-motion';
// import { useEffect } from 'react';

// export default function LightboxModal({ media, onClose }) {
//   useEffect(() => {
//     const handleEsc = (event) => {
//       if (event.key === 'Escape') {
//         onClose();
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => {
//       window.removeEventListener('keydown', handleEsc);
//     };
//   }, [onClose]);

//   if (!media) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.9 }}
//         onClick={(e) => e.stopPropagation()} // Prevents closing on modal body click
//         className="relative max-w-5xl w-full h-auto max-h-[90vh] rounded-lg overflow-hidden shadow-2xl"
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white text-3xl z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
//         >
//           &times;
//         </button>
//         {media.type === 'image' ? (
//           <Image
//             src={media.src}
//             alt={media.alt}
//             width={1280}
//             height={720}
//             className="object-contain w-full h-full"
//           />
//         ) : (
//           <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
//             <iframe
//               src={`https://www.youtube.com/embed/${media.videoId}?autoplay=1&rel=0`}
//               title={media.title}
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               className="absolute top-0 left-0 w-full h-full"
//             ></iframe>
//           </div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// }