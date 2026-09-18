import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCarouselProps {
  images: string[];
  productName: string;
}

export default function ProductCarousel({
  images,
  productName,
}: ProductCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  /*
   * Reset the carousel whenever the selected product's
   * image list changes.
   */
  useEffect(() => {
    setCurrent(0);
    setImageError(false);
  }, [images]);

  // Reset image error whenever the image changes
  useEffect(() => {
    setImageError(false);
  }, [current]);

  const prev = () => {
    if (images.length <= 1) return;

    setCurrent((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    if (images.length <= 1) return;

    setCurrent((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      next();
    }, 3500);

    return () => clearInterval(interval);
  }, [current, isHovered, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-[#1976C5]/20 bg-[#0B1B2A]">
        <span className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          No Image
        </span>
      </div>
    );
  }

  // Encode spaces and other special characters safely
  const imageSrc = encodeURI(images[current]);

  return (
    <div
      className="
        relative
        w-full
        aspect-square
        overflow-hidden
        rounded-2xl
        border
        border-[#1976C5]/20
        bg-[#0B1B2A]
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {!imageError ? (
          <motion.img
            key={`${imageSrc}-${current}`}
            src={imageSrc}
            alt={`${productName} ${current + 1}`}
            draggable={false}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) {
                next();
              } else if (info.offset.x > 80) {
                prev();
              }
            }}
            onError={(event) => {
              console.error(
                "Product image failed to load:",
                event.currentTarget.src
              );

              setImageError(true);
            }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            className="
              relative
              z-10
              block
              w-full
              h-full
              object-contain
              p-6
              cursor-grab
              active:cursor-grabbing
              select-none
            "
          />
        ) : (
          <motion.div
            key="image-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              absolute
              inset-0
              z-10
              flex
              flex-col
              items-center
              justify-center
              gap-3
              p-6
              text-center
            "
          >
            <div className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Image Not Found
            </div>

            <div className="max-w-full break-all text-xs text-zinc-600">
              {imageSrc}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Gold Gradient */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
          bg-gradient-to-t
          from-black
          via-transparent
          to-transparent
        "
      />

      {/* Premium Gold Glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
          shadow-[inset_0_0_40px_rgba(25,118,197,0.12)]
        "
      />

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
            className="
              absolute
              left-3
              top-1/2
              z-30
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-[#1976C5]/30
              bg-black/60
              text-[#1976C5]
              opacity-0
              transition-all
              duration-300
              hover:bg-[#1976C5]
              hover:text-black
              group-hover:opacity-100
            "
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            className="
              absolute
              right-3
              top-1/2
              z-30
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-[#1976C5]/30
              bg-black/60
              text-[#1976C5]
              opacity-0
              transition-all
              duration-300
              hover:bg-[#1976C5]
              hover:text-black
              group-hover:opacity-100
            "
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-3">
          {images.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={(event) => {
                event.stopPropagation();
                setCurrent(index);
              }}
              className={`rounded-full transition-all duration-300 ${
                current === index
                  ? "h-2 w-8 bg-[#1976C5]"
                  : "h-2.5 w-2.5 bg-white/30 hover:bg-[#1976C5]"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
