import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-[43px] mb-6 mt-24 rounded-[2rem] bg-forest-900 px-6 py-10 sm:mx-[84px] sm:mt-32 sm:px-10 lg:mx-[158px]">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-2xl font-bold uppercase tracking-tight">
            Watendawili
          </p>
          <p className="mt-2 max-w-xs text-sm text-sage-dim">
            Afro-fusion from Nairobi. Merch is a demo storefront — no real
            payments are processed.
          </p>
        </div>

        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-sage-dim">
              Explore
            </span>
            <Link href="/#shop" className="text-sage hover:text-cream">
              Shop
            </Link>
            <Link href="/music" className="text-sage hover:text-cream">
              Music
            </Link>
            <Link href="/tour" className="text-sage hover:text-cream">
              Tour
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-cream/10 pt-6 text-xs text-sage-dim">
        © {new Date().getFullYear()} Watendawili. Fan-made demo storefront.
      </div>
    </footer>
  );
}
