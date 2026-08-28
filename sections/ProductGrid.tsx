"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { products } from "@/lib/products";
import { ProductCategory } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

const filters: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Tees", value: "Tees" },
  { label: "Tanks", value: "Tanks" },
  { label: "Sleeveless Crop Tee", value: "Sleeveless Crop Tee" },
];

export default function ProductGrid() {
  const [active, setActive] = useState<ProductCategory | "all">("all");

  const visible = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.category === active)),
    [active]
  );

  return (
    <section id="shop" className="mx-[43px] mt-16 scroll-mt-28 sm:mx-[84px] sm:mt-24 lg:mx-[158px]">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <h2 className="font-display text-4xl font-bold leading-[0.95] sm:text-5xl">
          Wear The
          <br />
          Sound.
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActive(filter.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === filter.value
                  ? "bg-cream text-forest-950"
                  : "border border-cream/15 text-sage hover:text-cream"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
      >
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </section>
  );
}
