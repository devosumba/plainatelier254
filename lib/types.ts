export type ProductCategory = "apparel" | "accessories" | "music";

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  inStock: boolean;
  stockNote: string;
};

export type CartLine = {
  product: Product;
  quantity: number;
};
