"use client";

import Default from "@/components/store-components/Product/Details/Default";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

const ProductDefault = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [productData] = api.product.getAllPretty.useSuspenseQuery();

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="default"
        productId={productId}
      />
      <Default data={productData} productId={productId} />
    </>
  );
};

export default ProductDefault;
