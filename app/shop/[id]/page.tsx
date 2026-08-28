import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ProductImageToggle from "@/components/product/ProductImageToggle";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import { getProductById, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  const title = `${product.name} — Watendawili Merch`;
  const description = `${product.description} ${formatPrice(product.price)}, official Watendawili merch.`;
  const url = `${SITE_URL}/shop/${product.id}`;

  return {
    // product.name already starts with "Watendawili" — use an absolute
    // title so the root layout's "%s | Watendawili" template doesn't
    // append the brand name a second time.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${SITE_URL}${product.image}`,
    brand: { "@type": "Brand", name: "Watendawili" },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/shop/${product.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Navbar />
      <main className="flex-1 px-3 pb-24 pt-28 sm:px-6 lg:px-10">
        <Link
          href="/#shop"
          className="text-sm text-sage-dim transition-colors hover:text-cream"
        >
          &larr; Back to Shop
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductImageToggle product={product} />

          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-cream/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-sage">
              {product.category}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-sage-dim">{product.subtitle}</p>
            {product.fabricColor && (
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full border border-cream/40 ${
                    product.fabricColor === "White" ? "bg-white" : "bg-black"
                  }`}
                />
                <span className="text-xs text-sage-dim">
                  {product.fabricColor} fabric
                </span>
              </div>
            )}
            <p className="mt-6 max-w-md text-sm leading-relaxed text-sage">
              {product.description}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="font-display text-2xl font-semibold">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-sage-dim">{product.stockNote}</span>
            </div>

            <div className="mt-6 max-w-sm">
              <AddToCartPanel product={product} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
