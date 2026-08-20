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
    <section className="relative mx-3 mt-3 overflow-hidden rounded-[2.5rem] sm:mx-6 sm:mt-6 lg:mx-10 lg:mt-10">
      <div className="absolute inset-0">
        <SafeImage
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80&auto=format&fit=crop"
          alt="Watendawili live"
          fallbackLabel="WATENDAWILI"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/60 to-forest-950" />
        <div className="absolute inset-0 bg-forest-950/30" />
      </div>

      <div className="relative flex min-h-[85vh] flex-col justify-end px-5 pb-24 pt-32 sm:px-10 sm:pb-28 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] text-sage"
        >
          Nairobi, Kenya · Afro-fusion duo
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 font-display font-extrabold uppercase leading-[0.88] tracking-tight text-cream text-[11vw] sm:text-[9vw] lg:text-[7rem]"
        >
          Feel the
          <br />
          sound of
          <br />
          Watendawili
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-md text-sm text-sage sm:text-base"
        >
          Israel Onyach and Eugine &quot;Ywaya&quot; Ywaya blend R&B, soul and
          Afrobeat with the rhythms of Luo folk music. Known for &quot;Cham
          Thum (Atoti)&quot; and &quot;Sio Siri,&quot; they write songs that
          move rooms and mean something.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 flex max-w-xs items-center gap-3 rounded-2xl border border-cream/25 bg-forest-950/60 p-3 shadow-lg shadow-black/30 backdrop-blur-md"
        >
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-forest-800">
            <SafeImage
              src="https://images.unsplash.com/photo-1619516513368-cb90b3407258?w=200&q=80&auto=format&fit=crop"
              alt="Watendawili duo portrait"
              fallbackLabel="W"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-cream">Est. 2020</p>
            <p className="text-xs text-sage">
              Formerly Kaskazini, all in the name of sound.
            </p>
          </div>
        </motion.div>

        <div className="mt-10 flex items-center justify-between sm:absolute sm:bottom-28 sm:right-10 sm:mt-0 lg:right-16">
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
