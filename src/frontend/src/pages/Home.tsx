import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { AmenitiesSection } from "../components/AmenitiesSection";
import { BookingForm } from "../components/BookingForm";
import { ImageGallery } from "../components/ImageGallery";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700'%3E%3Crect width='1200' height='700' fill='%232a6496'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='28' fill='%23d8eaf8'%3ESolemar · Muro Alto%3C/text%3E%3C/svg%3E";

const HERO_IMAGES = [
  "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/3.jpg",
  "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/1.jpg",
  "https://brevelar.s3.amazonaws.com/media/apartment/AG02H/4.jpg",
];

const HIGHLIGHTS = [
  { label: "Muro Alto Beach", icon: MapPin },
  { label: "4.9 ★ Rating", icon: Star },
  { label: "Sleeps up to 6", icon: null },
];

function HeroSection() {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-[90vh] flex items-end pb-16 overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGES[0]}
          alt="Solemar seaside flat balcony view over Muro Alto beach"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_SVG;
          }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-secondary/90 text-secondary-foreground rounded-full px-4 py-1.5 mb-5 text-sm font-body font-semibold"
          >
            <MapPin size={13} />
            Muro Alto, Pernambuco, Brasil
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-6xl md:text-8xl font-bold text-card mb-4 leading-none tracking-tight">
            Solemar
          </h1>
          <p className="font-body text-xl md:text-2xl text-card/90 mb-3 leading-snug">
            Seaside Flat &mdash; Muro Alto, PE, Brasil
          </p>
          <p className="font-body text-base md:text-lg text-card/75 mb-8 max-w-lg leading-relaxed">
            Your paradise at Muro Alto. Wake up to turquoise waves, fall asleep
            to the rhythm of the Atlantic — in a flat designed for those who
            demand the best from life.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-3 mb-8">
            {HIGHLIGHTS.map((h) => (
              <span
                key={h.label}
                className="inline-flex items-center gap-1.5 bg-card/15 backdrop-blur-sm border border-card/30 text-card rounded-full px-4 py-1 text-sm font-body"
              >
                {h.icon && <h.icon size={13} />}
                {h.label}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={scrollToBooking}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body font-semibold text-base px-8 shadow-lifted transition-smooth"
              data-ocid="hero.primary_button"
            >
              Book Your Stay
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-card/50 text-card bg-card/10 backdrop-blur-sm hover:bg-card/20 font-body font-semibold text-base px-8"
              data-ocid="hero.secondary_button"
            >
              View Photos
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className="text-card/60 text-xs font-body tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.6,
            ease: "easeInOut",
          }}
          className="w-0.5 h-6 bg-card/40 rounded-full"
        />
      </motion.div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-16 bg-muted/20" id="about" data-ocid="about.section">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4 leading-tight">
              A Warm Retreat by the Atlantic
            </h2>
            <p className="font-body text-muted-foreground mb-4 leading-relaxed">
              Solemar is a carefully curated seaside flat nestled within the
              exclusive Porto de Galinhas resort area of Muro Alto. With a
              front-row seat to one of Brazil's most spectacular coastlines,
              every moment here feels like a postcard.
            </p>
            <p className="font-body text-muted-foreground mb-6 leading-relaxed">
              The flat features an open-plan living and dining area bathed in
              natural light, a fully equipped kitchen, two elegantly furnished
              bedrooms, and a wide shaded balcony where the sea breeze greets
              you at sunrise. Guests enjoy exclusive access to resort amenities:
              an infinity pool, private beach club, restaurants, and concierge
              service.
            </p>
            <ul className="space-y-2 font-body text-sm text-foreground">
              {[
                "Prime beachfront location in Muro Alto",
                "Resort facilities — pool, beach club, restaurants",
                "Dedicated concierge and 24h security",
                "Modern design with Brazilian charm",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Image collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-3"
          >
            {HERO_IMAGES.map((src, idx) => (
              <div
                key={src}
                className={`overflow-hidden rounded-xl ${idx === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
              >
                <img
                  src={src}
                  alt={`Solemar view ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_SVG;
                  }}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <ImageGallery />
      <AmenitiesSection />
      <AboutSection />
      <BookingForm />
    </>
  );
}
