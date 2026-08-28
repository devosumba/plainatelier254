export type ProductCategory = "Tees" | "Tanks" | "Sleeveless Crop Tee" | "Magnets";

export type FabricColor = "White" | "Black";

export type Size = "S" | "M" | "L" | "XL";

export const SIZES: Size[] = ["S", "M", "L", "XL"];

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  backImage?: string;
  category: ProductCategory;
  fabricColor?: FabricColor;
  inStock: boolean;
  stockNote: string;
};

export function productHasSizes(product: Product): boolean {
  return product.category !== "Magnets";
}

export type CartLine = {
  product: Product;
  quantity: number;
  size?: Size;
};

export type CartLineKey = string;

export function lineKey(productId: string, size?: Size): CartLineKey {
  return size ? `${productId}::${size}` : productId;
}
