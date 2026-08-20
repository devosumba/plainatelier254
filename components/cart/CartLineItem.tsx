"use client";

import { CartLine } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import SafeImage from "@/components/ui/SafeImage";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";

export default function CartLineItem({ line }: { line: CartLine }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = line;

  return (
    <div className="flex gap-4 border-b border-cream/10 py-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-forest-900">
        <SafeImage
          src={product.image}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-xs text-sage-dim">{product.subtitle}</p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${product.name} from cart`}
            onClick={() => removeFromCart(product.id)}
            className="text-sage-dim transition-colors hover:text-cream"
          >
            <TrashIcon />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-full border border-cream/15 px-2 py-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="flex h-5 w-5 items-center justify-center text-cream/80 hover:text-cream"
            >
              <MinusIcon />
            </button>
            <span className="w-4 text-center text-xs font-medium">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="flex h-5 w-5 items-center justify-center text-cream/80 hover:text-cream"
            >
              <PlusIcon />
            </button>
          </div>
          <span className="text-sm font-medium">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
