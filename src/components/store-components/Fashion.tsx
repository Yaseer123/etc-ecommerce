"use client";

import React, { useState, useEffect } from "react";
import Product from "./Product/Product";
import { motion } from "framer-motion";
import { api } from "@/trpc/react";

const MenFashion = () => {
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

  if (isCategoriesLoading) {
    return <div className="text-center">Loading categories...</div>;
  }

  if (isCategoriesError) {
    return (
      <div className="text-red-500 text-center">
        Failed to load categories. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="tab-features-block pt-10 md:pt-20">
        <div className="container">
          <div className="heading flex flex-wrap items-center justify-between gap-5">
            <div className="heading3">Recently Added</div>
            <div className="menu-tab flex items-center gap-2 rounded-2xl bg-surface p-1">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className={`tab-item relative cursor-pointer px-5 py-2 text-secondary duration-500 hover:text-black ${
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
          </div>

          {isProductsLoading ? (
            <div className="mt-6 text-center">Loading products...</div>
          ) : isProductsError ? (
            <div className="text-red-500 mt-6 text-center">
              Failed to load products. Please try again later.
            </div>
          ) : (
            <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-[20px] sm:gap-[30px] md:mt-10 lg:grid-cols-4">
              {products
                ?.slice(0, 3)
                .map((prd, index) => (
                  <Product
                    key={index}
                    data={prd}
                    type="marketplace"
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

export default MenFashion;
