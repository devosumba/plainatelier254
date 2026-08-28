"use client";

import { useState } from "react";
import { Product, SIZES, Size, productHasSizes } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import PillButton from "@/components/ui/PillButton";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<Size | null>(null);
  const [added, setAdded] = useState(false);

  const needsSize = productHasSizes(product);
  const canAdd = product.inStock && (!needsSize || size !== null);

  function handleAdd() {
    if (!canAdd) return;
    addToCart(product, quantity, needsSize ? size! : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-4">
      {needsSize && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-sage-dim">
            Size
          </p>
          <div className="flex items-center gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                  size === s
                    ? "border-cream bg-cream text-forest-950"
                    : "border-cream/15 text-cream hover:border-cream/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-4 rounded-full border border-cream/15 px-4 py-3">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-5 w-5 items-center justify-center text-cream/80 hover:text-cream"
          >
            <MinusIcon />
          </button>
          <span className="w-4 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-5 w-5 items-center justify-center text-cream/80 hover:text-cream"
          >
            <PlusIcon />
          </button>
        </div>

        <PillButton onClick={handleAdd} disabled={!canAdd} className="flex-1">
          {!product.inStock
            ? "Sold Out"
            : added
              ? "Added to Cart"
              : needsSize && !size
                ? "Select a Size"
                : "Add to Cart"}
        </PillButton>
      </div>
    </div>
  );
}
