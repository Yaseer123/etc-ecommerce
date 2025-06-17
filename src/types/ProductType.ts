import type { Category, Product } from "@prisma/client";

export interface Variant {
  [key: string]: unknown;
  colorName?: string;
  colorHex?: string;
  size?: string;
  images?: string[];
  price?: number;
  discountedPrice?: number;
  stock?: number;
  imageId?: string;
  sku?: string;
}

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER";

export interface ProductType {
  id: string;
  title: string;
  featured: boolean;
  shortDescription: string;
  published: boolean;
  discountedPrice: number | null;
  stockStatus?: StockStatus;
  category: string;
  name: string;
  new: boolean;
  sale: boolean;
  rate: number;
  price: number;
  originPrice: number;
  brand: string;
  defaultColor?: string;
  defaultColorHex?: string | null;
  defaultSize?: string;
  sold: number;
  quantity: number;
  quantityPurchase: number;
  sizes: Array<string>;
  images: Array<string>;
  description: string;
  action: string;
  slug: string;
  attributes: Record<string, string>;
  variants?: Variant[] | string | null;
  sku?: string;
  imageId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  stock?: number;
  estimatedDeliveryTime?: number;
  categoryId?: string;
  deletedAt?: Date | null;
  descriptionImageId?: string;
  categoryAttributes?: Record<string, unknown>;
  position?: number;
}

export type ProductWithCategory = Product & {
  category: Category | null;
  defaultColor?: string | null;
  defaultColorHex?: string | null;
  defaultSize?: string | null;
  variants?: Variant[] | string | null;
};
