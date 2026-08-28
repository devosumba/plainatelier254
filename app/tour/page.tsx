import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Tour Dates",
  description:
    "Watendawili tour dates — catch the Nairobi Afro-fusion duo live. No shows announced yet; grab the Tour Capsule merch before the next run.",
};

export default function TourPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-40 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-sage">
          On the road
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Tour dates, coming soon.
        </h1>
        <p className="mt-4 max-w-md text-sm text-sage">
          No shows announced yet. Grab a piece of the Tour Capsule before the
          next run.
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
