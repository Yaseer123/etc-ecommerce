"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Category {
  id: number;
  name: string;
  subcategories: Category[];
}

interface CategoryAccordionProps {
  categories: Category[];
  onAddCategory: (parentId: number, name: string) => void;
  openAccordions: Record<number, boolean>;
  setOpenAccordions: (id: number) => void;
}

export function CategoryAccordion({
  categories,
  onAddCategory,
  openAccordions,
  setOpenAccordions,
}: CategoryAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onAddCategory={onAddCategory}
          openAccordions={openAccordions}
          setOpenAccordions={setOpenAccordions}
        />
      ))}
    </Accordion>
  );
}

function CategoryItem({
  category,
  onAddCategory,
  openAccordions,
  setOpenAccordions,
}: {
  category: Category;
  onAddCategory: (parentId: number, name: string) => void;
  openAccordions: Record<number, boolean>;
  setOpenAccordions: (id: number) => void;
}) {
  const [newCategoryName, setNewCategoryName] = useState("");

  return (
    <AccordionItem
      value={category.id.toString()}
      className="mb-2 rounded-lg border"
      data-open={openAccordions[category.id] ?? false}
    >
      <AccordionTrigger
        className="flex justify-between rounded-md bg-gray-100 p-3"
        onClick={() => setOpenAccordions(category.id)}
      >
        {category.name}
      </AccordionTrigger>
      <AccordionContent className="p-3">
        {/* Input to Add a New Subcategory */}
        <div className="flex items-center gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={`Add subcategory under ${category.name}`}
            className="w-full"
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (newCategoryName.trim()) {
                onAddCategory(category.id, newCategoryName.trim());
                setNewCategoryName("");
              }
            }}
          >
            Add
          </Button>
        </div>

        {/* Recursive Rendering of Subcategories */}
        {category.subcategories.length > 0 && (
          <div className="ml-4 mt-2 border-l-2 pl-4">
            <CategoryAccordion
              categories={category.subcategories}
              onAddCategory={onAddCategory}
              openAccordions={openAccordions}
              setOpenAccordions={setOpenAccordions}
            />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
