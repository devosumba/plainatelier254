"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { lineKey } from "@/lib/types";
import CartLineItem from "@/components/cart/CartLineItem";
import PillButton from "@/components/ui/PillButton";
import { CartIcon, CloseIcon } from "@/components/ui/icons";

export default function CartDrawer() {
  const router = useRouter();
  const { lines, subtotal, isOpen, closeCart } = useCart();

  function handleClose() {
    closeCart();
  }

  function handleCheckout() {
    closeCart();
    router.push("/checkout");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/60"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-forest-950 text-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
              <h2 className="font-display text-lg font-semibold">Your Cart</h2>
              <button
                type="button"
                aria-label="Close cart"
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream hover:bg-cream/10"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cream/15 text-sage">
                  <CartIcon className="h-6 w-6" />
                </div>
                <p className="font-display text-lg font-semibold">
                  Your cart is empty
                </p>
                <p className="text-sm text-sage">
                  Nothing here yet. Go find something unnecessarily good.
                </p>
                <PillButton href="/#shop" onClick={handleClose} className="mt-2">
                  Browse Merch
                </PillButton>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  {lines.map((line) => (
                    <CartLineItem
                      key={lineKey(line.product.id, line.size)}
                      line={line}
                    />
                  ))}
                </div>

                <div className="border-t border-cream/10 px-6 py-5">
                  <div className="mb-1 text-xs uppercase tracking-widest text-sage-dim">
                    Delivery calculated at checkout
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-sage">Subtotal</span>
                    <span className="font-display text-lg font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <PillButton onClick={handleCheckout} className="w-full">
                    Checkout
                  </PillButton>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
