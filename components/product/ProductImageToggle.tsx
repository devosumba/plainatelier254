"use client";

import { useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { Product } from "@/lib/types";

export default function ProductImageToggle({ product }: { product: Product }) {
  const [view, setView] = useState<"front" | "back">("front");
  const src = view === "back" && product.backImage ? product.backImage : product.image;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-forest-900">
        <SafeImage
          src={src}
          alt={`${product.name}, ${view}`}
          fallbackLabel={product.name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {!product.inStock && (
          <span className="absolute left-4 top-4 rounded-full bg-forest-950/80 px-3 py-1 text-xs font-medium text-cream backdrop-blur">
            Sold out
          </span>
        )}
      </div>

      {product.backImage && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView("front")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              view === "front"
                ? "bg-cream text-forest-950"
                : "border border-cream/15 text-sage hover:text-cream"
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setView("back")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              view === "back"
                ? "bg-cream text-forest-950"
                : "border border-cream/15 text-sage hover:text-cream"
            }`}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
