"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import PillButton from "@/components/ui/PillButton";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
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

      <PillButton
        onClick={handleAdd}
        disabled={!product.inStock}
        className="flex-1"
      >
        {!product.inStock ? "Sold Out" : added ? "Added to Cart" : "Add to Cart"}
      </PillButton>
    </div>
  );
}
