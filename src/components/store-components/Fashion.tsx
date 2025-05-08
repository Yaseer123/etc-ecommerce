"use client";

import React, { useState, useEffect } from "react";
import Product from "./Product/Product";
import { motion } from "framer-motion";
import { api } from "@/trpc/react";

const RecentlyAdded = () => {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = api.category.getAllParent.useQuery();

  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = api.product.getAllByCategory.useQuery(
    { categoryId: activeTab },
    {
      enabled: !!activeTab, // Only fetch products if a category is selected
    },
  );

  const handleTabClick = (categoryId: string) => {
    setActiveTab(categoryId);
  };

  // Set the default active tab to the first category when categories are loaded
  useEffect(() => {
    if (categories?.length && !activeTab && categories[0]) {
      setActiveTab(categories[0].id);
    }
  }, [categories, activeTab]);

  // Scroll active tab into view when changed
  useEffect(() => {
    if (activeTab) {
      const activeElement = document.getElementById(`tab-${activeTab}`);
      if (activeElement) {
        // Scroll the element into view with smooth behavior
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeTab]);

  if (isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="flex animate-pulse space-x-2">
          <div className="h-3 w-3 rounded-full bg-gray-400"></div>
          <div className="h-3 w-3 rounded-full bg-gray-400"></div>
          <div className="h-3 w-3 rounded-full bg-gray-400"></div>
        </div>
      </div>
    );
  }

  if (isCategoriesError) {
    return (
      <div className="text-red-500 py-10 text-center">
        Failed to load categories. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="tab-features-block pt-8 md:pt-20">
        <div className="container">
          <div className="heading flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-5">
            <div className="heading3 mb-2 md:mb-0">Recently Added</div>
            <div className="relative w-full overflow-hidden md:w-auto">
              <div className="menu-tab scrollbar-hide flex items-center gap-2 overflow-x-auto whitespace-nowrap rounded-2xl bg-surface p-1">
                {categories?.map((category) => (
                  <div
                    id={`tab-${category.id}`}
                    key={category.id}
                    className={`tab-item relative flex-shrink-0 cursor-pointer px-5 py-2 text-secondary duration-500 hover:text-black ${
                      activeTab === category.id ? "active" : ""
                    }`}
                    onClick={() => handleTabClick(category.id)}
                  >
                    {activeTab === category.id && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-2xl bg-white"
                      ></motion.div>
                    )}
                    <span className="text-button-uppercase relative z-[1]">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-surface to-transparent md:hidden"></div>
              <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-surface to-transparent md:hidden"></div>
            </div>
          </div>

          {isProductsLoading ? (
            <div className="mt-6 grid animate-pulse grid-cols-2 gap-[20px] sm:gap-[30px] md:mt-10 lg:grid-cols-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[250px] rounded-lg bg-gray-200"></div>
              ))}
            </div>
          ) : isProductsError ? (
            <div className="text-red-500 mt-6 text-center">
              Failed to load products. Please try again later.
            </div>
          ) : products?.length === 0 ? (
            <div className="mt-6 py-10 text-center">
              No products available in this category.
            </div>
          ) : (
            <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-[20px] sm:gap-[30px] md:mt-10 lg:grid-cols-4">
              {products
                ?.slice(0, 3)
                .map((prd, index) => (
                  <Product
                    key={index}
                    data={prd}
                    style="style-1"
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecentlyAdded;
