"use client";

import { motion } from "framer-motion";
import SafeImage from "@/components/ui/SafeImage";
import { PlayIcon } from "@/components/ui/icons";

export default function StoryStrip() {
  return (
    <section className="mx-[43px] mt-16 sm:mx-[84px] sm:mt-24 lg:mx-[158px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="lg:w-[40%]">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl font-bold leading-[1.05] sm:text-4xl"
          >
            From Nairobi
            <br />
            to the World.
          </motion.h2>
          <p className="mt-2 text-sm text-sage-dim">
            The Watendawili story, one release at a time.
          </p>
        </div>

        <motion.button
          type="button"
          aria-label="Play Watendawili story preview"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative h-40 w-full shrink-0 overflow-hidden rounded-3xl bg-forest-900 sm:h-44 lg:h-40 lg:w-56"
        >
          <SafeImage
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop"
            alt="Watendawili story preview"
            fallbackLabel="WATCH"
            fill
            sizes="(min-width: 1024px) 224px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-950/35" />
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-forest-950">
            <PlayIcon className="ml-0.5 h-4 w-4" />
          </span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-sm leading-relaxed text-sage sm:text-base lg:w-[40%]"
        >
          It doesn&apos;t have to sound like{" "}
          <span className="inline-flex items-center rounded-full bg-cream/10 px-3 py-1 text-xs font-medium text-cream align-middle">
            Luo rhythms
          </span>{" "}
          to move you. But it does. It&apos;s not your typical afro-fusion.
          It&apos;s unnecessarily good.
        </motion.p>
      </div>
    </section>
  );
}
