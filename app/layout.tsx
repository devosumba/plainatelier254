import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import CartDrawer from "@/components/cart/CartDrawer";
import GlobalLoader from "@/components/ui/GlobalLoader";
import { SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, SEO_KEYWORDS } from "@/lib/seo";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Watendawili",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-forest-950 text-cream">
        <MusicPlayerProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </MusicPlayerProvider>
        <GlobalLoader />
      </body>
    </html>
  );
}
