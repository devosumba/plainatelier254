"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Keeps `showLoader` true for at least `minDurationMs` after `isLoading`
 * first becomes true, even if `isLoading` flips back to false sooner —
 * so a gif-based loader never gets cut off mid-loop.
 */
export function useMinimumLoader(isLoading: boolean, minDurationMs: number): boolean {
  const [showLoader, setShowLoader] = useState(isLoading);
  const startedAtRef = useRef<number | null>(isLoading ? Date.now() : null);

  useEffect(() => {
    if (isLoading) {
      startedAtRef.current = Date.now();
      setShowLoader(true);
      return;
    }

    const startedAt = startedAtRef.current;
    if (startedAt === null) {
      setShowLoader(false);
      return;
    }

    const remaining = minDurationMs - (Date.now() - startedAt);
    if (remaining <= 0) {
      setShowLoader(false);
      return;
    }

    const timeout = setTimeout(() => setShowLoader(false), remaining);
    return () => clearTimeout(timeout);
  }, [isLoading, minDurationMs]);

  return showLoader;
}
