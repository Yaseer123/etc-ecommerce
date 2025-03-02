"use client";

import productData from "@/data/Product.json";
import ShopFilterCanvas from "@/components/store-components/Shop/ShopFilterCanvas";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/store-components/Footer";

export default function Fullwidth() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <>
      <ShopFilterCanvas
        data={productData}
        productPerPage={12}
        dataType={type}
        productStyle="grid"
      />
      <Footer />
    </>
  );
}
