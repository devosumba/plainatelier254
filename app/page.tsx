import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/sections/Hero";
import StoryStrip from "@/sections/StoryStrip";
import CollectionsRow from "@/sections/CollectionsRow";
import ProductGrid from "@/sections/ProductGrid";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StoryStrip />
        <CollectionsRow />
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}
