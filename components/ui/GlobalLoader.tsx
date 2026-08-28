"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loader, { LOADER_LOOP_DURATION_MS } from "./Loader";

export default function GlobalLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const isFirstRun = useRef(true);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);

    if (isFirstRun.current) {
      isFirstRun.current = false;
      const startedAt = Date.now();

      const finishInitialLoad = () => {
        const remaining = LOADER_LOOP_DURATION_MS - (Date.now() - startedAt);
        hideTimeout.current = setTimeout(() => setVisible(false), Math.max(remaining, 0));
      };

      if (document.readyState === "complete") {
        finishInitialLoad();
      } else {
        window.addEventListener("load", finishInitialLoad, { once: true });
      }

      return () => window.removeEventListener("load", finishInitialLoad);
    }

    setVisible(true);
    hideTimeout.current = setTimeout(() => setVisible(false), LOADER_LOOP_DURATION_MS);
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white">
      <Loader size={140} />
    </div>
  );
}
