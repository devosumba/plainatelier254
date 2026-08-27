"use client";

import { motion } from "framer-motion";
import PillButton from "@/components/ui/PillButton";
import SafeImage from "@/components/ui/SafeImage";

export default function Hero() {
  function scrollToShop() {
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative mx-3 mt-4 overflow-hidden rounded-[2.5rem] sm:mx-6 sm:mt-6 lg:mx-10">
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

      <div className="relative flex min-h-[85vh] flex-col justify-end px-5 pb-10 pt-32 sm:px-10 sm:pb-12 lg:px-16 lg:pb-14">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="whitespace-nowrap font-display font-extrabold uppercase leading-[0.88] tracking-tight text-cream text-[8vw]"
        >
          WEAR THE RYTHM !
        </motion.h1>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xs rounded-2xl border border-cream/25 bg-forest-950/60 px-4 py-3 shadow-lg shadow-black/30 backdrop-blur-md"
          >
            <p className="text-sm font-medium text-cream sm:text-base">
              Dive into the official Watendawili shop for exclusive, premium
              merchandise
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <PillButton onClick={scrollToShop} className="px-7 py-3.5 text-base">
              Shop Merch
            </PillButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
