"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartLine, Product } from "@/lib/types";
import { products } from "@/lib/products";

const STORAGE_KEY = "watendawili-cart";

type StoredLine = { productId: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  totalCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: StoredLine[] = JSON.parse(raw);
        const restored = stored
          .map((entry) => {
            const product = products.find((p: Product) => p.id === entry.productId);
            return product ? { product, quantity: entry.quantity } : null;
          })
          .filter((line): line is CartLine => line !== null);
        // Reading from localStorage is only possible client-side, after mount;
        // starting from an empty cart on the server avoids a hydration mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLines(restored);
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const toStore: StoredLine[] = lines.map((line) => ({
      productId: line.product.id,
      quantity: line.quantity,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [lines, hydrated]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.product.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setLines((prev) => prev.filter((line) => line.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) {
        return prev.filter((line) => line.product.id !== productId);
      }
      return prev.map((line) =>
        line.product.id === productId ? { ...line, quantity } : line
      );
    });
  }, []);

  const clearCart = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const totalCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0),
    [lines]
  );

  const value: CartContextValue = {
    lines,
    totalCount,
    subtotal,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
