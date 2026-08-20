"use client";

import { motion } from "framer-motion";
import SafeImage from "@/components/ui/SafeImage";
import CircleIconButton from "@/components/ui/CircleIconButton";
import { ArrowUpRightIcon, DiscIcon } from "@/components/ui/icons";

type Collection = {
  tag: string;
  title: string;
  description: string;
  stockNote: string;
  image: string;
};

const collections: Collection[] = [
  {
    tag: "Apparel",
    title: "Tour Capsule",
    description: "Hoodies, tees and jackets from the current run.",
    stockNote: "Only 50 pieces",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80&auto=format&fit=crop",
  },
  {
    tag: "Collectibles",
    title: "Studio Sessions",
    description: "Vinyl, posters and polaroids from En Route.",
    stockNote: "Only 50 pieces",
    image:
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&q=80&auto=format&fit=crop",
  },
  {
    tag: "Accessories",
    title: "Limited Drop",
    description: "Totes, wristbands and stickers, while they last.",
    stockNote: "Only 50 pieces",
    image:
      "https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?w=800&q=80&auto=format&fit=crop",
  },
];

function scrollToShop() {
  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
}

export default function CollectionsRow() {
  return (
    <section className="mx-3 mt-16 sm:mx-6 sm:mt-24 lg:mx-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {collections.map((collection, i) => (
          <motion.div
            key={collection.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative flex h-72 flex-col justify-between overflow-hidden rounded-3xl bg-forest-900 p-5"
          >
            <SafeImage
              src={collection.image}
              alt={collection.title}
              fallbackLabel={collection.title}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/25 to-forest-950/10" />

            <span className="relative w-fit rounded-full bg-cream/90 px-3 py-1 text-[11px] font-medium text-forest-950">
              {collection.tag}
            </span>

            <div className="relative">
              <h3 className="font-display text-xl font-semibold text-cream">
                {collection.title}
              </h3>
              <p className="mt-1 text-sm text-sage">{collection.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={scrollToShop}
                  className="flex items-center gap-2 text-xs font-medium text-cream/90"
                >
                  <DiscIcon className="h-3.5 w-3.5" />
                  Shop Now
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-sage-dim">
                    {collection.stockNote}
                  </span>
                  <CircleIconButton
                    label={`Shop ${collection.title}`}
                    size="sm"
                    onClick={scrollToShop}
                  >
                    <ArrowUpRightIcon className="h-3.5 w-3.5" />
                  </CircleIconButton>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
