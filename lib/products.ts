import { Product } from "./types";

export const products: Product[] = [
  {
    id: "cham-thum-hoodie",
    name: "Cham Thum Hoodie",
    subtitle: "Heavyweight fleece, embroidered chest hit",
    description:
      "A heavyweight cotton-blend hoodie named after the single that put Watendawili on the map. Embroidered wordmark on the chest, oversized fit.",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80&auto=format&fit=crop",
    category: "apparel",
    inStock: true,
    stockNote: "Only 50 pieces",
  },
  {
    id: "watendawili-logo-tee",
    name: "Watendawili Logo Tee",
    subtitle: "100% cotton, boxy fit",
    description:
      "Everyday tee in soft heavyweight cotton with the Watendawili wordmark printed across the front. Boxy, unisex fit.",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop",
    category: "apparel",
    inStock: true,
    stockNote: "In stock",
  },
  {
    id: "ywaya-signature-cap",
    name: "Ywaya Signature Cap",
    subtitle: "Structured 6-panel, adjustable strap",
    description:
      "A structured six-panel cap with Ywaya's signature stitched above the brim. Adjustable back strap, one size fits most.",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80&auto=format&fit=crop",
    category: "apparel",
    inStock: true,
    stockNote: "In stock",
  },
  {
    id: "onyach-bomber-jacket",
    name: "Onyach Bomber Jacket",
    subtitle: "Lightweight shell, satin lining",
    description:
      "A lightweight bomber built for stage and street, finished with a satin lining and an embroidered back graphic.",
    price: 8500,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80&auto=format&fit=crop",
    category: "apparel",
    inStock: false,
    stockNote: "Sold out",
  },
  {
    id: "duo-tote-bag",
    name: "Duo Tote Bag",
    subtitle: "Heavy canvas, internal pocket",
    description:
      "A durable canvas tote printed with the Watendawili duo mark. Roomy enough for vinyl, roomy enough for life.",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?w=800&q=80&auto=format&fit=crop",
    category: "accessories",
    inStock: true,
    stockNote: "In stock",
  },
  {
    id: "tour-wristband-pack",
    name: "Tour Wristband Pack",
    subtitle: "Set of 3, woven detail",
    description:
      "Three woven wristbands from the current tour run, each in a different colourway from the Watendawili palette.",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1603321581480-12bd571a7aa2?w=800&q=80&auto=format&fit=crop",
    category: "accessories",
    inStock: true,
    stockNote: "Only 50 pieces",
  },
  {
    id: "vinyl-sticker-sheet",
    name: "Vinyl Sticker Sheet",
    subtitle: "8 die-cut stickers, weatherproof",
    description:
      "A sheet of eight weatherproof, die-cut stickers pulled from Watendawili artwork and tour ephemera.",
    price: 600,
    image:
      "https://images.unsplash.com/photo-1625768376503-68d2495d78c5?w=800&q=80&auto=format&fit=crop",
    category: "accessories",
    inStock: true,
    stockNote: "In stock",
  },
  {
    id: "love-language-vinyl",
    name: "Love Language Vinyl",
    subtitle: "12\" LP, limited pressing",
    description:
      "A limited-run 12\" pressing of Love Language, cut for warmth and mastered for vinyl. Includes a printed inner sleeve.",
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&q=80&auto=format&fit=crop",
    category: "music",
    inStock: true,
    stockNote: "Only 50 pieces",
  },
  {
    id: "sio-siri-limited-poster",
    name: "Sio Siri Limited Poster",
    subtitle: "18x24in, matte litho print",
    description:
      "A matte litho print of the Sio Siri cover art, numbered in a limited run for the studio sessions collection.",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1610566725828-5e945c71393d?w=800&q=80&auto=format&fit=crop",
    category: "music",
    inStock: true,
    stockNote: "In stock",
  },
  {
    id: "signed-polaroid-set",
    name: "Signed Polaroid Set",
    subtitle: "Set of 2, hand-signed",
    description:
      "Two hand-signed polaroids from the En Route studio sessions, no two sets are exactly alike.",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80&auto=format&fit=crop",
    category: "music",
    inStock: false,
    stockNote: "Sold out",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
