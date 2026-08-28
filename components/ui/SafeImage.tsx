"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import Loader, { LOADER_LOOP_DURATION_MS } from "./Loader";
import { useMinimumLoader } from "./useMinimumLoader";

type SafeImageProps = Omit<ImageProps, "onError" | "alt"> & {
  alt: string;
  fallbackLabel?: string;
};

export default function SafeImage({
  alt,
  fallbackLabel,
  className,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showLoader = useMinimumLoader(!failed && !loaded, LOADER_LOOP_DURATION_MS);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-forest-800 via-forest-850 to-forest-950 p-4 text-center ${className ?? ""}`}
      >
        <span className="font-display text-xs uppercase tracking-[0.2em] text-sage">
          {fallbackLabel ?? alt}
        </span>
      </div>
    );
  }

  return (
    <>
      {showLoader && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
          <Loader size={48} />
        </div>
      )}
      <Image
        alt={alt}
        className={className}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </>
  );
}
