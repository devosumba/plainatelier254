import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Watendawili's discography — the Nairobi Afro-fusion duo blending Afrobeat, R&B and Luo folk influences. Streaming links coming soon.",
};

export default function MusicPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-40 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-sage">
          Discography
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Music, coming soon.
        </h1>
        <p className="mt-4 max-w-md text-sm text-sage">
          Streaming links and the full discography are on the way. In the
          meantime, hear it in the merch.
        </p>
        <Link
          href="/#shop"
          className="mt-8 rounded-full bg-cream px-6 py-3 text-sm font-medium text-forest-950"
        >
          Shop Merch
        </Link>
      </main>
    </>
  );
}
