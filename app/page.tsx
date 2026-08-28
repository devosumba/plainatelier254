import Navbar from "@/components/layout/Navbar";
import Hero from "@/sections/Hero";
import StoryStrip from "@/sections/StoryStrip";
import ProductGrid from "@/sections/ProductGrid";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-24 lg:pb-32">
        <Hero />
        <StoryStrip />
        <ProductGrid />
      </main>
    </>
  );
}
