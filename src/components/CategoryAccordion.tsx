"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface Category {
  id: string;
  name: string;
  subcategories: Category[];
}

interface CategoryAccordionProps {
  categories: Category[];
}

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </Accordion>
  );
}

function CategoryItem({ category }: { category: Category }) {
  return (
    <AccordionItem
      value={category.id.toString()}
      className="mb-2 rounded-lg border"
    >
      <AccordionTrigger
        disabled={category.subcategories.length === 0}
        className="flex justify-between rounded-md bg-gray-100 p-3"
      >
        {category.name}
      </AccordionTrigger>
      <AccordionContent className="p-3">
        {/* Recursive Rendering of Subcategories */}
        {category.subcategories.length > 0 && (
          <div className="ml-4 mt-2 border-l-2 pl-4">
            <CategoryAccordion categories={category.subcategories} />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
