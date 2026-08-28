import Navbar from "@/components/layout/Navbar";
import Hero from "@/sections/Hero";
import StoryStrip from "@/sections/StoryStrip";
import ProductGrid from "@/sections/ProductGrid";
import { SITE_URL } from "@/lib/seo";

const musicGroupJsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Watendawili",
  alternateName: "Kaskazini",
  description:
    "Watendawili (formerly known as Kaskazini) is a Nairobi, Kenya-based Afro-fusion duo blending Afrobeat, R&B and Luo folk influences.",
  genre: ["Afro-fusion", "R&B", "Afrobeat", "Luo folk"],
  foundingLocation: {
    "@type": "Place",
    name: "Nairobi, Kenya",
  },
  url: SITE_URL,
  image: `${SITE_URL}/images/hero/watendawili-live.jpg`,
  member: [
    { "@type": "Person", name: "Israel Onyach" },
    { "@type": "Person", name: "Eugine Ywaya", alternateName: "Ywaya Tajiri" },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Watendawili Official Merch",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  image: `${SITE_URL}/images/hero/watendawili-live.jpg`,
  description:
    "Official online merch store for Watendawili, Nairobi's Afro-fusion duo.",
  email: "watendawilibookings@gmail.com",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-24 lg:pb-32">
        <Hero />
        <StoryStrip />
        <ProductGrid />
      </main>
    </>
  );
}
