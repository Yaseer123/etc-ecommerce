// interface Variation {
//   color: string;
//   colorCode: string;
//   colorImage: string;
//   image: string;
// }

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
}
