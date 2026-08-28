"use client";

import { motion } from "framer-motion";
import SafeImage from "@/components/ui/SafeImage";

export default function Hero() {
  return (
    <section className="relative mx-[43px] mt-4 overflow-hidden rounded-[2.5rem] sm:mx-[84px] sm:mt-6 lg:mx-[158px]">
      <div className="absolute inset-0">
        <SafeImage
          src="/images/hero/watendawili-live.jpg"
          alt="Watendawili live"
          fallbackLabel="WATENDAWILI"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_68%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/60 to-forest-950" />
        <div className="absolute inset-0 bg-forest-950/30" />
      </div>

      <div className="relative flex min-h-[85vh] flex-col justify-end pb-14 pt-32 sm:pb-16 lg:pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="whitespace-nowrap text-center font-display font-extrabold uppercase leading-[0.88] tracking-tight text-cream text-[8vw]"
        >
          WEAR THE RYTHM !
        </motion.h1>
      </div>
    </section>
  );
}
