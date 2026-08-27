"use client";

import { motion } from "framer-motion";
import PillButton from "@/components/ui/PillButton";
import CircleIconButton from "@/components/ui/CircleIconButton";
import SafeImage from "@/components/ui/SafeImage";
import { ArrowDownIcon } from "@/components/ui/icons";

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

      <div className="relative flex min-h-[85vh] flex-col justify-end px-5 pb-24 pt-32 sm:px-10 sm:pb-28 lg:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="-mx-5 font-display font-extrabold uppercase leading-[0.88] tracking-tight text-cream text-[8.25vw] sm:-mx-10 sm:text-[6.75vw] lg:-mx-16 lg:text-[5.25rem]"
        >
          WEAR THE RYTHM OF WATENDAWILI!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="-mx-5 mt-6 text-sm text-sage sm:-mx-10 sm:text-base lg:-mx-16"
        >
          Dive into the official Watendawili shop for exclusive, premium
          merchandise
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="-mx-5 mt-3 text-sm text-sage sm:-mx-10 sm:text-base lg:-mx-16"
        >
          Grab your gear today, stream our latest tracks, and represent the
          movement wherever you go
        </motion.p>

        <div className="mt-10 flex items-center justify-between lg:absolute lg:bottom-28 lg:right-16 lg:mt-0">
          <PillButton onClick={scrollToShop} className="px-7 py-3.5 text-base">
            Shop Merch
          </PillButton>
        </div>

        <CircleIconButton
          label="Scroll to explore"
          variant="outlineOnDark"
          onClick={scrollToShop}
          className="absolute bottom-8 left-5 sm:left-10 lg:left-16"
        >
          <ArrowDownIcon className="h-4 w-4" />
        </CircleIconButton>
      </div>
    </section>
  );
}
