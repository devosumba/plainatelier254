import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SafeImage from "@/components/ui/SafeImage";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import { getProductById, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
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

  return (
    <>
      <Navbar />
      <main className="flex-1 px-3 pb-24 pt-28 sm:px-6 lg:px-10">
        <Link
          href="/#shop"
          className="text-sm text-sage-dim transition-colors hover:text-cream"
        >
          &larr; Back to Shop
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-forest-900">
            <SafeImage
              src={product.image}
              alt={product.name}
              fallbackLabel={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {!product.inStock && (
              <span className="absolute left-4 top-4 rounded-full bg-forest-950/80 px-3 py-1 text-xs font-medium text-cream backdrop-blur">
                Sold out
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-cream/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-sage">
              {product.category}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-sage-dim">{product.subtitle}</p>
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
      <Footer />
    </>
  );
}
