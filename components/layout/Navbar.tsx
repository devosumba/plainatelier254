"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CartIcon } from "@/components/ui/icons";

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();
  const isHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-6">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-full bg-cream/95 px-2 py-2 text-forest-950 shadow-lg shadow-black/20 backdrop-blur">
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isHome
                ? "bg-forest-950 text-cream"
                : "text-forest-950/70 hover:text-forest-950"
            }`}
          >
            Home
          </Link>
          <Link
            href="/#shop"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !isHome
                ? "bg-forest-950 text-cream"
                : "text-forest-950/70 hover:text-forest-950"
            }`}
          >
            Shop
          </Link>
        </nav>

        <button
          type="button"
          aria-label={`Open cart, ${totalCount} item${totalCount === 1 ? "" : "s"}`}
          onClick={openCart}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-950 text-cream"
        >
          <CartIcon className="h-4 w-4" />
          {totalCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cream px-1 text-[11px] font-semibold text-forest-950">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
