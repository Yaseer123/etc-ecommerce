import { useState } from "react";
import { type CategoryTree } from "@/schemas/categorySchema";
import { api } from "@/trpc/react";

const CategoryItem = ({
  category,
  handleCategory,
}: {
  category: CategoryTree;
  handleCategory: (categoryId: string, categoryName: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="space-y-2 border-b border-line pb-2">
      <div className="flex items-center justify-between" onClick={toggleExpand}>
        <span
          className={`${category.subcategories && category.subcategories.length > 0 ? "cursor-pointer" : ""}`}
          onClick={() => handleCategory(category.id, category.name)}
        >
          {category.name}
        </span>
        {category.subcategories && category.subcategories.length > 0 && (
          <span className="cursor-pointer text-lg text-gray-500">
            {expanded ? "−" : "+"}
          </span>
        )}
      </div>
      {expanded &&
        category.subcategories &&
        category.subcategories.length > 0 && (
          <div className="ml-2 space-y-2">
            {category.subcategories.map((child) => (
              <CategoryItem
                handleCategory={handleCategory}
                key={child.id}
                category={child}
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default function FilterByCategory({
  handleCategory,
}: {
  handleCategory: (categoryId: string, categoryName: string) => void;
}) {
  const [categories] = api.category.getAll.useSuspenseQuery();
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryItem
          handleCategory={handleCategory}
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
}
