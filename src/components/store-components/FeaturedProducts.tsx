"use client";

import { api } from "@/trpc/react";
import { type ProductWithCategory } from "@/types/ProductType";
import Product from "./Product/Product";

function isProductWithCategory(val: unknown): val is ProductWithCategory {
  if (!val || typeof val !== "object") return false;
  return (
    "id" in val &&
    "title" in val &&
    "images" in val &&
    "price" in val &&
    "discountedPrice" in val &&
    "category" in val
  );
}

export default function FeaturedProducts() {
  const { data: featuredProducts = [], isLoading } =
    api.product.getFeaturedProducts.useQuery(
      { limit: 9999999 },
      { refetchOnWindowFocus: false },
    );

  const validProducts = featuredProducts.filter(isProductWithCategory);

  if (!validProducts.length) return null;

  return (
    <section className="mx-auto w-full max-w-screen-xl px-4 py-8 sm:px-6 md:py-12">
      <div className="mb-6 text-center md:mb-10">
        <h2 className="mb-1 text-4xl font-semibold dark:text-white sm:text-2xl md:text-3xl">
          Featured Products
        </h2>
        <p className="mx-auto max-w-xl text-sm text-gray-500 dark:text-gray-200 sm:text-base">
          Our handpicked selection of premium products
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-black sm:h-10 sm:w-10" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {validProducts.map((product) => (
            <Product key={product.id} data={product} />
          ))}
        </div>
      )}
    </section>
  );
}
