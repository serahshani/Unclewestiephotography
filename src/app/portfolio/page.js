"use client";

import Navbar from '../Components/navbar';
import Image from 'next/image';
import Link from 'next/link'; // Still useful for external links like YouTube
import { useState } from 'react';
import LightboxModal from '../Components/LightboxModal'; // Import the new modal component

export default function PortfolioPage() {
  // Combined and categorized media data
  const categories = [
    {
      id: 'all',
      name: 'All Media',
      media: [
        { type: 'image', src: '/Hero1.png', alt: 'Wedding Studios', category: 'weddings' },
        { type: 'image', src: '/Gallery1.jpg', alt: 'Portrait Session', category: 'portraits' },
        { type: 'video', videoId: 'axuNuWaIToE', title: 'SAINAPNAP BY LENAMBA', category: 'events' },
        { type: 'image', src: '/Gallery2.jpg', alt: 'Landscape View', category: 'landscapes' },
        { type: 'image', src: '/Gallery3.jpg', alt: 'Fashion Shoot', category: 'fashion' },
        { type: 'video', videoId: 'QWUz8hmrtJU', title: 'THE SUNSET AT LOSUK TOWN - Nairobi', category: 'landscapes' },
        { type: 'image', src: '/Gallery4.jpg', alt: 'Event Coverage', category: 'events' },
        { type: 'image', src: '/Gallery5.jpg', alt: 'Wildlife Capture', category: 'wildlife' },
        { type: 'video', videoId: 'yFrNnazQep8', title: 'PAPA MAASAI PERFORMANCE', category: 'events' },
        { type: 'image', src: '/Hero2.jpg', alt: 'Nature Beauty', category: 'landscapes' },
        { type: 'image', src: '/Hero3.jpg', alt: 'Urban Exploration', category: 'urban' },
        { type: 'video', videoId: 'jv5gAGERo68', title: 'SAMBURU GOVERNORS CUP 2025 PREPARATION', category: 'events' },
      ],
    },
    {
      id: 'weddings',
      name: 'Weddings',
      media: [
        { type: 'image', src: '/Hero1.png', alt: 'Wedding Studios' },
        { type: 'video', videoId: '31sWI0Fb8tY', src:'https://www.youtube.com/watch?v=31sWI0Fb8tY', title: 'MERINA LOLCHURAGI WEDS REUBEN LEITORE (DOGO MILLA) ;SAMBURU TRADITIONAL WEDDING AT LODUNGOKWE,'},
        {type: 'video', videoId: 'DbccT3_tw8o', src:'https://www.youtube.com/watch?v=DbccT3_tw8o', title: 'JAMILA WEDS JEREMIAH -A SAMBURU WEDDING at NKEJEMUNY Samburu-Performance by LENARASHA AND SAMSELLAH'},
        {type: 'video', videoId: 'S0IX1sQ8zRo', src:'https://www.youtube.com/watch?v=S0IX1sQ8zRo', title: 'FELISTER WEDS ATINGAE-A SAMBURU WEDDING at Lerata Samburu-Performance by SAMSELLAH and STARCAB'},
        {type: 'video', videoId: 'iJzD2C_dO3E', src:'https://www.youtube.com/watch?v=iJzD2C_dO3E', title: 'DIANA WEDS NDECCAH- A SAMBURU WEDDING at MARALAL -Performance by Fantez and Starca B'},
        // Add more wedding specific images/videos here
      ],
    },
    {
      id: 'portraits',
      name: 'Portraits',
      media: [
        { type: 'image', src: '/Gallery1.jpg', alt: 'Portrait Session' },
        // Add more portrait specific images/videos here
      ],
    },
    {
      id: 'events',
      name: 'Events',
      media: [
        { type: 'image', src: '/Gallery4.jpg', alt: 'Event Coverage' },
        { type: 'video', videoId: 'axuNuWaIToE', title: 'SAINAPNAP BY LENAMBA' },
        { type: 'video', videoId: 'yFrNnazQep8', title: 'PAPA MAASAI PERFORMANCE' },
        { type: 'video', videoId: 'jv5gAGERo68', title: 'SAMBURU GOVERNORS CUP 2025 PREPARATION' },
        // Add more event specific images/videos here
      ],
    },
    {
        id: 'landscapes',
        name: 'Landscapes',
        media: [
          { type: 'image', src: '/Gallery2.jpg', alt: 'Landscape View' },
          { type: 'image', src: '/Hero2.jpg', alt: 'Nature Beauty' },
          { type: 'video', videoId: 'QWUz8hmrtJU', title: 'THE SUNSET AT LOSUK TOWN - Nairobi' },
          // Add more landscape specific images/videos here
        ],
      },
    // Add more categories as needed (e.g., 'fashion', 'wildlife', 'urban')
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId) => {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  };

  // Filter media based on active category
  const filteredMedia = activeCategory === 'all'
    ? categories.find(cat => cat.id === 'all').media
    : categories.find(cat => cat.id === activeCategory)?.media || [];

  // Function to open the lightbox
  const openLightbox = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setLightboxOpen(true);
  };

  // Function to close the lightbox
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

          {/* Category Navigation */}
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

          {/* Dynamic Media Gallery Section */}
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
                  // Change from Link to a div with onClick
                  onClick={() => openLightbox(mediaItem)}
                  className="relative w-full overflow-hidden group aspect-w-1 aspect-h-1 rounded-md shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
                  style={{ paddingTop: '100%' }} // Maintain aspect ratio for square items
                >
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
                      <div className="relative w-full h-full">
                        <Image
                          src={getYouTubeThumbnail(mediaItem.videoId)}
                          alt={`Thumbnail for ${mediaItem.videoId}`}
                          fill={true}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                      <div className="p-4 bg-white absolute bottom-0 left-0 right-0">
                        <p className="text-lg font-semibold text-gray-800 group-hover:text-[#012D26] transition-colors duration-300">
                          {mediaItem.title}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600 text-xl">No media found for this category.</p>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <LightboxModal media={selectedMedia} onClose={closeLightbox} />
      )}
    </>
  );
}