import { useState } from "react";
import { type CategoryTree } from "@/schemas/categorySchema";
import { api } from "@/trpc/react";
import { CaretDown, CaretRight } from "@phosphor-icons/react/dist/ssr";

const CategoryItem = ({
  category,
  handleCategory,
}: {
  category: CategoryTree;
  handleCategory: (id: string, name: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const hasChildren =
    category.subcategories && category.subcategories.length > 0;

  return (
    <div className="category-item mb-1">
      <div
        onClick={() => handleCategory(category.id, category.name)}
        className="group flex cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-orange-50"
      >
        <span className="flex items-center font-medium text-gray-700 transition-colors group-hover:text-orange-600">
          {category.name}
        </span>

        {hasChildren && (
          <button
            onClick={toggleExpand}
            className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-orange-100 hover:text-orange-500"
          >
            {expanded ? (
              <CaretDown size={16} weight="bold" />
            ) : (
              <CaretRight size={16} weight="bold" />
            )}
          </button>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="ml-2 mt-1 space-y-1 border-l border-orange-100 pl-4">
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
  handleCategory: (id: string, name: string) => void;
}) {
  const [categories] = api.category.getAll.useSuspenseQuery();
  return (
    <div className="space-y-1 rounded-lg">
      {categories.map((category) => (
        console.log(category),
        <CategoryItem
          handleCategory={handleCategory}
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
}
