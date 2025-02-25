"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import productData from "@/data/Product.json";
import Menu from "@/components/store-components/Menu";
import External from "@/components/store-components/Product/Details/External";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";
import TopNav from "@/components/store-components/TopNav";

const ProductCombinedTwo = () => {
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
          productPage="external"
          productId={productId}
        />
      </div>
      <External data={productData} productId={productId} />
    </>
  );
};

export default ProductCombinedTwo;
