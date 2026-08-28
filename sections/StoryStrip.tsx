"use client";

import { motion } from "framer-motion";
import SafeImage from "@/components/ui/SafeImage";
import { PlayIcon, PauseIcon, SkipNextIcon, SkipPreviousIcon } from "@/components/ui/icons";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

const overlayControlClasses =
  "flex items-center justify-center rounded-full bg-cream/80 text-forest-950 backdrop-blur-sm transition-opacity disabled:opacity-40";

export default function StoryStrip() {
  const { isReady, isPlaying, toggle, next, previous } = useMusicPlayer();

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
            Grab your gear today, stream our latest tracks
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative h-40 w-full shrink-0 overflow-hidden rounded-3xl bg-forest-900 sm:h-44 lg:h-40 lg:w-56"
        >
          <SafeImage
            src="/images/story/watendawili-story.jpg"
            alt="Watendawili, Israel Onyach and Eugine Ywaya performing live in Nairobi"
            fallbackLabel="WATCH"
            fill
            sizes="(min-width: 1024px) 224px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-950/35" />
          <div className="absolute inset-0 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous track"
              onClick={previous}
              disabled={!isReady}
              className={`h-8 w-8 ${overlayControlClasses}`}
            >
              <SkipPreviousIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? "Pause Watendawili playlist" : "Play Watendawili playlist"}
              onClick={toggle}
              className={`h-11 w-11 ${overlayControlClasses}`}
            >
              {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="ml-0.5 h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              aria-label="Next track"
              onClick={next}
              disabled={!isReady}
              className={`h-8 w-8 ${overlayControlClasses}`}
            >
              <SkipNextIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-sm leading-relaxed text-sage sm:text-base lg:w-[40%]"
        >
          Dive into the official Watendawili shop, with merch from Israel
          Onyach and Eugine &ldquo;Ywaya&rdquo; Ywaya, the Nairobi,
          Kenya-based Afro-fusion duo (formerly Kaskazini) blending Afrobeat,
          R&amp;B and Luo folk influences.
        </motion.p>
      </div>
    </section>
  );
}
