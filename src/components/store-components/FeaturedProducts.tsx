"use client";

import { api } from "@/trpc/react";
import Product from "./Product/Product";
import React from "react";

export default function FeaturedProducts() {
  const { data: featuredProducts = [], isLoading } =
    api.product.getFeaturedProducts.useQuery(
      { limit: 4 },
      { refetchOnWindowFocus: false },
    );

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto mt-8 px-4 sm:mt-10 md:mt-16 lg:mt-20">
      <div className="mb-6 md:mb-10 flex flex-col items-center justify-center">
        <h2 className="mb-1 text-2xl font-semibold sm:text-2xl md:text-3xl md:mb-2">Featured Products</h2>
        <p className="text-sm text-center text-gray-500 px-4 sm:text-base">
          Our handpicked selection of premium products
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Product key={product.id} data={product} type="marketplace" />
          ))}
        </div>
      )}
    </div>
  );
}
