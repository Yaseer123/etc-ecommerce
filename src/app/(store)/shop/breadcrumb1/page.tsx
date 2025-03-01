"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import productData from "@/data/Product.json";
import Footer from "@/components/store-components/Footer";
import ShopBreadCrumb1 from "@/components/store-components/Shop/ShopBreadCrumb1";
import { Menu } from "lucide-react";
import TopNav from "@/components/store-components/TopNav";

export default function BreadCrumb1() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<string | null | undefined>();
  const datatype = searchParams.get("type");
  const gender = searchParams.get("gender");
  const category = searchParams.get("category");

  useEffect(() => {
    setType(datatype);
  }, [datatype]);

  return (
    <>
      <TopNav
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
      </div>
      <ShopBreadCrumb1
        data={productData}
        productPerPage={9}
        dataType={type}
        gender={gender}
        category={category}
      />
      <Footer />
    </>
  );
}
