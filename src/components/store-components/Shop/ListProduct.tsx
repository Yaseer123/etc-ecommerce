"use client";

// import productData from "@/data/Product.json";
import { api } from "@/trpc/react";
import ShopFilterCanvas from "./ShopFilterCanvas";

export default function ListProduct() {
  const [productData] = api.product.getAllPretty.useSuspenseQuery();

  return (
    <ShopFilterCanvas
      data={productData}
      productPerPage={12}
      productStyle="style-1"
    />
  );
}
