"use client";

import { api } from "@/trpc/react";
import type { ProductWithCategory } from "@/types/ProductType";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Product from "./Product/Product";

function isProductWithCategory(val: unknown): val is ProductWithCategory {
  if (!val || typeof val !== "object") return false;

  const obj = val as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    Array.isArray(obj.images) &&
    typeof obj.price === "number" &&
    typeof obj.discountedPrice === "number" &&
    typeof obj.category === "object"
  );
}

const RecentlyAdded = () => {
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = api.category.getAllParentOrderedByRecentProduct.useQuery();

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = api.product.getAllByCategory.useQuery(
    { categoryId: activeTab ?? "" },
    { enabled: !!activeTab },
  );

  useEffect(() => {
    if (categories?.length && activeTab === null) {
      setActiveTab(categories[0]?.id ?? null);
    }
  }, [categories, activeTab]);

  useEffect(() => {
    if (activeTab) {
      const activeElement = document.getElementById(`tab-${activeTab}`);
      if (activeElement && typeof window !== "undefined") {
        activeElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [activeTab]);

  const handleTabClick = (categoryId: string) => {
    setActiveTab(categoryId);
  };

  const visibleProducts = useMemo(() => {
    return products.slice(0, 12).filter(isProductWithCategory);
  }, [products]);

  const isLoading = isCategoriesLoading || isProductsLoading;
  const isError = isCategoriesError || isProductsError;

  return (
    <section className="bg-transparent py-10 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-white">
            Recently Added
          </h2>

          {/* Tabs */}
          <div className="relative w-full overflow-hidden md:w-auto">
            <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto whitespace-nowrap rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-800">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  id={`tab-${category.id}`}
                  role="tab"
                  aria-selected={activeTab === category.id}
                  tabIndex={0}
                  onClick={() => handleTabClick(category.id)}
                  className={`relative z-10 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeTab === category.id
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {activeTab === category.id && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 z-0 rounded-xl bg-white shadow-md dark:bg-zinc-700"
                    />
                  )}
                  <span className="relative z-10">{category.name}</span>
                </div>
              ))}
            </div>

            {/* Mobile gradient fades */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-zinc-100 to-transparent dark:from-zinc-800 md:hidden" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-zinc-100 to-transparent dark:from-zinc-800 md:hidden" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 md:mt-12">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-48 rounded-lg bg-zinc-200 dark:bg-zinc-700"></div>
                  <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                  <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-10 text-center text-red-500 dark:text-red-400">
              Failed to load data. Please try again later.
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="py-10 text-center text-zinc-500 dark:text-zinc-400">
              No products available in this category.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <Product key={product.id} data={product} style="style-1" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentlyAdded;
