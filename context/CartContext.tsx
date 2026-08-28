"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartLine, Product, Size, lineKey } from "@/lib/types";
import { products } from "@/lib/products";

const STORAGE_KEY = "watendawili-cart";

type StoredLine = { productId: string; quantity: number; size?: Size };

type CartContextValue = {
  lines: CartLine[];
  totalCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, size?: Size) => void;
  removeFromCart: (productId: string, size?: Size) => void;
  updateQuantity: (productId: string, quantity: number, size?: Size) => void;
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
        const restored: CartLine[] = [];
        for (const entry of stored) {
          const product = products.find((p: Product) => p.id === entry.productId);
          if (!product) continue;
          restored.push(
            entry.size
              ? { product, quantity: entry.quantity, size: entry.size }
              : { product, quantity: entry.quantity }
          );
        }
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
      size: line.size,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [lines, hydrated]);

  const addToCart = useCallback((product: Product, quantity = 1, size?: Size) => {
    setLines((prev) => {
      const key = lineKey(product.id, size);
      const existing = prev.find((line) => lineKey(line.product.id, line.size) === key);
      if (existing) {
        return prev.map((line) =>
          lineKey(line.product.id, line.size) === key
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }
      return [...prev, { product, quantity, size }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, size?: Size) => {
    const key = lineKey(productId, size);
    setLines((prev) => prev.filter((line) => lineKey(line.product.id, line.size) !== key));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: Size) => {
      const key = lineKey(productId, size);
      setLines((prev) => {
        if (quantity <= 0) {
          return prev.filter((line) => lineKey(line.product.id, line.size) !== key);
        }
        return prev.map((line) =>
          lineKey(line.product.id, line.size) === key ? { ...line, quantity } : line
        );
      });
    },
    []
  );

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
