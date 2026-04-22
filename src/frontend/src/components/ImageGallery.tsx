import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

// Hotlinked from https://reservas.brevelar.com.br/en/apartment/AG02H
const GALLERY_IMAGES = [
  {
    src: "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/1.jpg",
    alt: "Solemar balcony with ocean view",
  },
  {
    src: "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/2.jpg",
    alt: "Solemar bedroom with sea breeze",
  },
  {
    src: "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/3.jpg",
    alt: "Tropical pool surrounded by palms",
  },
  {
    src: "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/4.jpg",
    alt: "Pristine Muro Alto beach",
  },
  {
    src: "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/5.jpg",
    alt: "Spacious living area",
  },
  {
    src: "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/6.jpg",
    alt: "Modern kitchen with ocean light",
  },
  {
    src: "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/7.jpg",
    alt: "Resort-style infinity pool",
  },
  {
    src: "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/8.jpg",
    alt: "Dining area and terrace",
  },
];

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e8d8c0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23a08060'%3ESolemar%3C/text%3E%3C/svg%3E";

interface GalleryImageProps {
  src: string;
  alt: string;
  onClick: () => void;
  index: number;
}

function GalleryImage({ src, alt, onClick, index }: GalleryImageProps) {
  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = PLACEHOLDER_SVG;
    },
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-xl cursor-pointer group aspect-[4/3]"
      onClick={onClick}
      data-ocid={`gallery.item.${index + 1}`}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={handleError}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
        <span className="text-card opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-body font-semibold tracking-wide uppercase">
          View
        </span>
      </div>
    </motion.div>
  );
}

export function ImageGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : 0,
    );
  const goNext = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % GALLERY_IMAGES.length : 0));

  return (
    <section
      className="py-16 bg-background"
      id="gallery"
      data-ocid="gallery.section"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Explore Our Flat
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Every corner of Solemar was crafted to bring the sea closer to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GALLERY_IMAGES.map((img, idx) => (
            <GalleryImage
              key={img.src}
              src={img.src}
              alt={img.alt}
              index={idx}
              onClick={() => openLightbox(idx)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
            data-ocid="gallery.dialog"
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-card hover:text-accent transition-colors duration-200 p-2"
              onClick={closeLightbox}
              aria-label="Close lightbox"
              data-ocid="gallery.close_button"
            >
              <X size={28} />
            </button>
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-card hover:text-accent transition-colors duration-200 p-2"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
              data-ocid="gallery.pagination_prev"
            >
              <ChevronLeft size={36} />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              src={GALLERY_IMAGES[lightboxIndex].src}
              alt={GALLERY_IMAGES[lightboxIndex].alt}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_SVG;
              }}
              className="max-h-[80vh] max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-card hover:text-accent transition-colors duration-200 p-2"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
              data-ocid="gallery.pagination_next"
            >
              <ChevronRight size={36} />
            </button>
            <div className="absolute bottom-4 text-card/70 font-body text-sm">
              {lightboxIndex + 1} / {GALLERY_IMAGES.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
