"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import TrendingNow from "@/components/store-components/TrendingNow";
import ShopCollection from "@/components/store-components/Shop/ShopCollection";
import data from "@/data/Product.json";

interface Category {
  name: string;
  path: string;
  icon: React.ElementType;
  subcategories: { name: string; path: string }[];
}

// Categories Data with added icons
const categories: Category[] = [
  {
    name: "Electronics",
    path: "/category/electronics",
    icon: Icon.DeviceTablet,
    subcategories: [
      { name: "Mobile Phones", path: "/categories/electronics/mobile-phones" },
      { name: "Laptops", path: "/category/electronics/laptops" },
      { name: "Accessories", path: "/category/electronics/accessories" },
    ],
  },
  {
    name: "Fashion",
    path: "/category/fashion",
    icon: Icon.TShirt,
    subcategories: [
      { name: "Men's Clothing", path: "/category/fashion/men" },
      { name: "Women's Clothing", path: "/category/fashion/women" },
      { name: "Shoes", path: "/category/fashion/shoes" },
    ],
  },
  {
    name: "Home & Kitchen",
    path: "/category/home-kitchen",
    icon: Icon.Couch,
    subcategories: [
      { name: "Furniture", path: "/category/home-kitchen/furniture" },
      { name: "Appliances", path: "/category/home-kitchen/appliances" },
    ],
  },
  {
    name: "Beauty & Care",
    path: "/category/beauty-care",
    icon: Icon.PaintBrush,
    subcategories: [
      { name: "Makeup", path: "/category/beauty-care/makeup" },
      { name: "Skincare", path: "/category/beauty-care/skincare" },
      { name: "Haircare", path: "/category/beauty-care/haircare" },
    ],
  },
];

export default function CategoriesPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    setOpenCategory((prevOpen) =>
      prevOpen === categoryName ? null : categoryName,
    );
  };

  return (
    <>
      {/* 🔹 Breadcrumb Section */}
      <div className="breadcrumb-block style-img">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="container relative pb-10 pt-24 lg:pt-[134px]">
            <div className="main-content relative z-[1] flex h-full w-full flex-col items-center justify-center">
              <div className="text-content">
                <div className="heading2 text-center">Categories</div>
                <div className="link caption1 mt-3 flex items-center justify-center gap-1">
                  <Link href={"/"}>Homepage</Link>
                  <Icon.CaretRight size={14} className="text-secondary2" />
                  <div className="capitalize text-secondary2">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Categories Accordion (Using Flexbox) */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Shop By Category
          </h2>

          {/* 🔥 FLEXBOX LAYOUT */}
          <div className="flex flex-wrap justify-center gap-8">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                className={`w-full overflow-hidden rounded-xl transition-all duration-300 sm:w-[48%] lg:w-[30%] xl:w-[23%] ${
                  openCategory === category.name ? "shadow-xl" : "shadow-none"
                }`}
                whileHover={{ y: -8 }}
              >
                {/* 📌 Category Card */}
                <div
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category.name)}
                >
                  {/* Category Header with Gradient */}
                  <div
                    className={`relative h-40 overflow-hidden bg-gradient-to-r ${
                      category.name === "Electronics"
                        ? "from-blue-500 to-purple-600"
                        : category.name === "Fashion"
                          ? "from-pink-500 to-rose-500"
                          : category.name === "Home & Kitchen"
                            ? "from-amber-500 to-orange-600"
                            : "from-emerald-500 to-teal-600"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <category.icon
                        size={80}
                        weight="light"
                        className="text-white opacity-30"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-5">
                      <h3 className="text-2xl font-bold text-white">
                        {category.name}
                      </h3>
                    </div>

                    {/* Animated Indicator */}
                    <motion.div
                      className="absolute bottom-4 right-4 rounded-full bg-white p-2"
                      animate={{
                        rotate: openCategory === category.name ? 180 : 0,
                      }}
                    >
                      <Icon.CaretDown className="text-gray-800" weight="bold" />
                    </motion.div>
                  </div>
                </div>

                {/* 📌 Subcategories with Animation */}
                <AnimatePresence>
                  {openCategory === category.name && (
                    <motion.div
                      key={`${category.name}-subcategories`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: { duration: 0.3 },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: { duration: 0.3 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-gray-100 bg-white p-0">
                        {category.subcategories.map((sub, index) => (
                          <motion.div
                            key={sub.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              transition: { delay: index * 0.1, duration: 0.3 },
                            }}
                            exit={{
                              opacity: 0,
                              x: -20,
                              transition: { duration: 0.2 },
                            }}
                          >
                            <Link
                              href={sub.path}
                              className="block p-4 text-gray-700 transition-all hover:bg-gray-50 hover:pl-6 hover:text-black"
                            >
                              <div className="flex items-center justify-between">
                                <span>{sub.name}</span>
                                <Icon.ArrowRight
                                  size={16}
                                  className="opacity-50"
                                />
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* 🔹 Trending Categories */}
      <TrendingNow />
      {/* Collections */}
      <ShopCollection data={data} />
    </>
  );
}
