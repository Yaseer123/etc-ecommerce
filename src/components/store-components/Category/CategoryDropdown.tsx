"use client";

import Link from "next/link";
import useCategoryPopup from "@/hooks/useCategoryPopup";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/trpc/react";
import { CaretDown, CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { CategoryTree } from "@/schemas/categorySchema";

const CategoryDropdown = () => {
  const [categories, { error }] = api.category.getAll.useSuspenseQuery();
  const { openCategoryPopup, handleCategoryPopup } = useCategoryPopup();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [delayedHoveredCategory, setDelayedHoveredCategory] = useState<
    string | null
  >(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedHoveredCategory(hoveredCategory);
    }, 300); // Increased delay to 300ms for smoother transitions
    return () => clearTimeout(timeout);
  }, [hoveredCategory]);

  if (error) return <div>Error: {error.message}</div>;

  const renderSubcategories = (subcategories: CategoryTree[]) => {
    return (
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: 1,
          width: "200px",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute left-full top-0 z-10 min-w-[200px] overflow-hidden border border-gray-200 bg-white shadow-lg"
        onMouseEnter={() => setHoveredCategory(delayedHoveredCategory)} // Keep dropdown visible
        // onMouseLeave={() => setHoveredCategory(null)} // Allow smooth exit
      >
        {subcategories.map((sub) => (
          <div
            key={sub.id}
            className="group relative px-4 py-2 hover:bg-gray-200"
            onMouseEnter={() => setHoveredCategory(sub.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link
              href={`/categories/${sub.id}`}
              className="inline-block whitespace-nowrap"
            >
              {sub.name}
            </Link>
            {sub.subcategories?.length > 0 && (
              <CaretRight className="absolute right-2 top-1/2 -translate-y-1/2" />
            )}
            {delayedHoveredCategory === sub.id &&
              sub.subcategories?.length > 0 &&
              renderSubcategories(sub.subcategories)}
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="relative h-full">
      {/* Main Category Button */}
      <div
        className="relative flex h-full w-fit cursor-pointer items-center gap-6 rounded-l bg-black px-4 py-2"
        onClick={handleCategoryPopup}
      >
        <div className="whitespace-nowrap text-base font-semibold capitalize leading-[26px] text-white md:text-base md:leading-6">
          All Categories
        </div>
        <CaretDown color="#ffffff" />
      </div>

      {/* Dropdown Menu */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: openCategoryPopup ? 1 : 0,
          width: openCategoryPopup ? "100%" : "0%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`box-shadow-sm absolute left-0 right-0 top-[44px] h-max rounded-b-2xl bg-white ${
          openCategoryPopup ? "visible" : "invisible"
        }`}
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="group relative"
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Parent Category */}
            <div className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100">
              <Link
                href={`/categories/${category.id}`}
                className="inline-block max-w-[180px] truncate" // Prevent text overflow
              >
                {category.name}
              </Link>
              {category.subcategories?.length > 0 && (
                <CaretRight
                  className={`transition-transform ${
                    delayedHoveredCategory === category.id ? "rotate-90" : ""
                  }`}
                />
              )}
            </div>

            {/* Render Subcategories */}
            {delayedHoveredCategory === category.id &&
              category.subcategories?.length > 0 &&
              renderSubcategories(category.subcategories)}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryDropdown;
