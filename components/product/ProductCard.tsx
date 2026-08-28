"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product, productHasSizes } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import SafeImage from "@/components/ui/SafeImage";
import CircleIconButton from "@/components/ui/CircleIconButton";
import { ArrowUpRightIcon, HeartIcon } from "@/components/ui/icons";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col"
    >
      <Link
        href={`/shop/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-3xl bg-forest-900"
      >
        <SafeImage
          src={product.image}
          alt={product.name}
          fallbackLabel={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-forest-950/80 px-3 py-1 text-[11px] font-medium text-cream backdrop-blur">
            Sold out
          </span>
        )}
      </Link>

      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => setWished((w) => !w)}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 text-forest-950"
      >
        <HeartIcon className="h-4 w-4" filled={wished} />
      </button>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-cream">{product.name}</p>
          <p className="text-xs text-sage-dim">{product.subtitle}</p>
          {product.fabricColor && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className={`h-3 w-3 rounded-full border border-cream/40 ${
                  product.fabricColor === "White" ? "bg-white" : "bg-black"
                }`}
              />
              <span className="text-[11px] text-sage-dim">
                {product.fabricColor}
              </span>
            </div>
          )}
          <p className="mt-1 text-sm font-medium text-cream">
            {formatPrice(product.price)}
          </p>
        </div>
        {productHasSizes(product) ? (
          <Link
            href={`/shop/${product.id}`}
            aria-label={`Choose a size for ${product.name}`}
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-forest-950"
          >
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <CircleIconButton
            label={
              product.inStock
                ? `Add ${product.name} to cart`
                : `${product.name} is sold out`
            }
            size="sm"
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            className="mt-0.5"
          >
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </CircleIconButton>
        )}
      </div>
    </motion.div>
  );
}
