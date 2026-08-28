import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import CartDrawer from "@/components/cart/CartDrawer";
import GlobalLoader from "@/components/ui/GlobalLoader";
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
  title: "Watendawili — Official Merch",
  description:
    "Shop official Watendawili merch — apparel, accessories and collectibles from the Nairobi Afro-fusion duo.",
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
