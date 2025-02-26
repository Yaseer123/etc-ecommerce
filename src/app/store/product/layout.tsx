"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

import Menu from "@/components/store-components/Menu";

interface ProductLayoutProps {
  children: React.ReactNode;
  productPage: string;
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ children }) => {
  return (
    <>
      <div id="header" className="relative w-full">
        <Menu props="bg-white" />
      </div>
      {children}
    </>
  );
};

export default ProductLayout;
