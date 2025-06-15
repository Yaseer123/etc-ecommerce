import type { Category, Product } from "@prisma/client";

export interface Variant {
  color?: string;
  size?: string;
  images?: string[];
  price?: number;
  discountedPrice?: number;
  stock?: number;
  imageId?: string;
}

export interface ProductType {
  id: string;
  category: string;
  name: string;
  new: boolean;
  sale: boolean;
  rate: number;
  price: number;
  originPrice: number;
  brand: string;
  sold: number;
  quantity: number;
  quantityPurchase: number;
  sizes: Array<string>;
  images: Array<string>;
  description: string;
  action: string;
  slug: string;
  attributes: Record<string, string>;
  variants?: Variant[];
}

export type ProductWithCategory = Product & {
  category: Category | null;
};
