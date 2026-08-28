export type ProductCategory = "Tees" | "Tanks" | "Sleeveless Crop Tee" | "Magnets";

export type FabricColor = "White" | "Black";

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  fabricColor?: FabricColor;
  inStock: boolean;
  stockNote: string;
};

export type CartLine = {
  product: Product;
  quantity: number;
};
