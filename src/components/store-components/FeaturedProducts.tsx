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
    <div className="container mx-auto mt-10 md:mt-20">
      <div className="mb-10 flex flex-col items-center justify-center">
        <h2 className="mb-2 text-3xl font-semibold">Featured Products</h2>
        <p className="text-gray-500">
          Our handpicked selection of premium products
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Product key={product.id} data={product} type="marketplace" />
          ))}
        </div>
      )}
    </div>
  );
}
