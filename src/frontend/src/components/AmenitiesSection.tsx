import {
  Car,
  Palmtree,
  Shield,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";
import { motion } from "motion/react";

const AMENITIES = [
  {
    icon: Waves,
    label: "Pool",
    description: "Infinity pool with ocean panorama",
  },
  {
    icon: Wind,
    label: "Air Conditioning",
    description: "Split AC in all rooms",
  },
  {
    icon: Wifi,
    label: "Wi-Fi",
    description: "High-speed fibre throughout",
  },
  {
    icon: UtensilsCrossed,
    label: "Balcony",
    description: "Furnished terrace, sea breeze",
  },
  {
    icon: Car,
    label: "Parking",
    description: "Secure underground garage",
  },
  {
    icon: Shield,
    label: "24h Security",
    description: "Gated condominium, 24/7 patrol",
  },
  {
    icon: Palmtree,
    label: "Beach Access",
    description: "Direct access to Muro Alto beach",
  },
];

export function AmenitiesSection() {
  return (
    <section
      className="py-16 bg-muted/30"
      id="amenities"
      data-ocid="amenities.section"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Amenities & Features
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Everything you need for a perfect beach escape, thoughtfully
            included.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {AMENITIES.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <motion.div
                key={amenity.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="card-warm p-5 flex flex-col items-center text-center gap-3 hover-lift"
                data-ocid={`amenities.item.${index + 1}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon size={22} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground leading-tight">
                    {amenity.label}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5 leading-snug">
                    {amenity.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
