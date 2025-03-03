"use client";
import React from "react";


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
