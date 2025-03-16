import Link from "next/link";
import useCategoryPopup from "@/hooks/useCategoryPopup";
import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/trpc/react";
import { CaretDown, CaretRight } from "@phosphor-icons/react/dist/ssr";

const CategoryDropdown = () => {
  const [categories, { error, isLoading }] =
    api.category.getAll.useSuspenseQuery();
  const { openCategoryPopup, handleCategoryPopup } = useCategoryPopup();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Example categories with nested subcategories

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

      {/* Dropdown Menu with Width Animation */}
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
            key={category.name}
            className="group relative"
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Parent Category */}
            <div className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100">
              <Link
                href={`categories/${category.name}`}
                className="inline-block whitespace-nowrap"
              >
                {category.name}
              </Link>
              {category.subcategories && (
                <CaretRight
                  className={`transition-transform ${
                    hoveredCategory === category.name ? "rotate-90" : ""
                  }`}
                />
              )}
            </div>

            {/* Subcategories with Width Animation (Fully Visible) */}
            {category.subcategories && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: hoveredCategory === category.name ? 1 : 0,
                  width: hoveredCategory === category.name ? "200px" : "0px",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute left-full top-0 min-w-[200px] overflow-hidden border border-gray-200 bg-white shadow-lg"
                style={{
                  display: hoveredCategory === category.name ? "block" : "none", // Ensures visibility
                }}
              >
                {category.subcategories.map((sub) => (
                  <div key={sub.name} className="px-4 py-2 hover:bg-gray-200">
                    <Link
                      href={`categories/${category.name}/${sub.name}`}
                      className="inline-block whitespace-nowrap"
                    >
                      {sub.name}
                    </Link>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryDropdown;
