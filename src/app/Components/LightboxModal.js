// ../Components/LightboxModal.js
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const LightboxModal = ({ media, onClose }) => {
  if (!media) return null; // Don't render if no media is provided

  // Define animation variants for the modal
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4" // Increased z-index
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Backdrop (Click to close) */}
        <div
          className="absolute inset-0 bg-black bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative max-w-full max-h-[90vh] w-auto h-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col"
          variants={modalVariants}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
            aria-label="Close"
          >
            &times;
          </button>

          {media.type === 'image' ? (
            // Image Display
            <div className="relative w-[80vw] h-[80vh] max-w-[900px] max-h-[600px]">
              <Image
                src={media.src}
                alt={media.alt}
                fill
                className="object-contain" // Use object-contain to ensure whole image is visible
                priority
              />
            </div>
          ) : (
            // Video Display (YouTube Embed)
            <div className="relative w-[90vw] h-[50vw] max-w-[1000px] max-h-[562px]"> {/* 16:9 aspect ratio max */}
              <iframe
                src={`https://www.youtube.com/embed/${media.videoId}?autoplay=1`} // Autoplay video
                title={media.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          )}

          {/* Title/Caption (Optional) */}
          <div className="p-4 bg-gray-900 text-white text-center">
            <p className="text-lg font-semibold">{media.type === 'image' ? media.alt : media.title}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LightboxModal;