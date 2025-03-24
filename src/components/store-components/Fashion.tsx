"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Product from "./Product/Product";
import { motion } from "framer-motion";
import { api } from "@/trpc/react";

const MenFashion = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { data: categories, isLoading } =
    api.category.getAllWithProducts.useQuery();

  const handleTabClick = (categoryId: string | null) => {
    setActiveTab(categoryId);
  };

  if (isLoading) {
    return <div>Loading products and categories</div>;
  }

  if (!categories) {
    return <div>Couldn&apos;t fetch categories</div>;
  }

  return (
    <>
      <div className="tab-features-block pt-10 md:pt-20">
        <div className="container">
          <div className="heading flex flex-wrap items-center justify-between gap-5">
            <div className="heading3">Recently added</div>
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

          <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-[20px] sm:gap-[30px] md:mt-10 lg:grid-cols-4">          
            {categories
              .find((category) => category.id === activeTab)
              ?.products?.map((prd) => (
                <Product
                  key={prd.id}
                  data={prd}
                  type="marketplace"
                  style="style-1"
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenFashion;
