"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import productData from "@/data/Product.json";
import Menu from "@/components/store-components/Menu";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";
import FixedPrice from "@/components/store-components/Product/Details/FixedPrice";
import TopNav from "@/components/store-components/TopNav";

const ProductFixedPrice = () => {
  const searchParams = useSearchParams();
  let productId = searchParams.get("id");

  if (productId === null) {
    productId = "1";
  }

  return (
    <>
      <TopNav
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-white" />
        <BreadcrumbProduct
          data={productData}
          productPage="fixed-price"
          productId={productId}
        />
      </div>
      <FixedPrice data={productData} productId={productId} />
    </>
  );
};

export default ProductFixedPrice;
