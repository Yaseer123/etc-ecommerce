"use client";

import React from "react";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { ProductWithCategory } from "@/types/ProductType";
import { api } from "@/trpc/react";

interface Props {
  data: ProductWithCategory;
}

const BreadcrumbProduct: React.FC<Props> = ({ data }) => {
  const {
    data: categoryHierarchy,
    isLoading,
    isError,
  } = api.category.getHierarchy.useQuery({
    id: data.categoryId!,
  });

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-secondary2">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">
          Failed to load category hierarchy. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="bg-surface bg-[linear-gradient(87deg,#f9f1f0_4.3%,#faf7f1_95.7%)] bg-no-repeat pb-8 pt-12">
          <div className="mx-auto flex w-full !max-w-[1322px] flex-wrap items-center justify-between gap-3 px-4">
            <div className="left flex items-center gap-1">
              <Link
                href={"/"}
                className="text-base font-normal leading-6 text-secondary2 hover:underline md:text-base"
              >
                Homepage
              </Link>
              <CaretRight size={12} className="text-secondary2" />
              {categoryHierarchy?.map((cat, index) => (
                <React.Fragment key={cat.id}>
                  <Link
                    href={`/products?category=${cat.id}`}
                    className="text-base font-normal leading-6 text-secondary2 hover:underline md:text-base"
                  >
                    {cat.name}
                  </Link>
                  {index < categoryHierarchy.length - 1 && (
                    <CaretRight size={12} className="text-secondary2" />
                  )}
                </React.Fragment>
              ))}
              <CaretRight size={12} className="text-secondary2" />
              <div className="text-base font-normal capitalize leading-6 md:text-base">
                {data.title}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreadcrumbProduct;
