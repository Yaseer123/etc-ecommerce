"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import productData from "@/data/Product.json";

import ShopBreadCrumb1 from "@/components/store-components/Shop/ShopBreadCrumb1";
import Menu from "@/components/store-components/Menu";

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
    </>
  );
}
