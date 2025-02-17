"use client";

import { useState } from "react";
import { CategoryAccordion } from "./CategoryAccordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

interface Category {
  id: number;
  name: string;
  subcategories: Category[];
}

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>(
    {},
  );

  const utils = api.useUtils();
  const addCategory = api.category.add.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
    },
  });

  // Function to open only one accordion at each level
  const handleAccordionToggle = (id: number) => {
    setOpenAccordions((prev) => {
      const newState = Object.keys(prev).reduce(
        (acc, key) => {
          acc[parseInt(key)] = false; // Close all
          return acc;
        },
        {} as Record<number, boolean>,
      );
      newState[id] = !prev[id]; // Toggle only the clicked one
      return newState;
    });
  };

  // Function to add a new category under a parent
  const handleAddCategory = (parentId: number | null, name: string) => {
    addCategory.mutate({ parentId, name });
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      <h2 className="mb-4 text-xl font-bold">Category Manager</h2>

      {/* Root Input for Adding Parent Categories */}
      <div className="mb-4 flex gap-2">
        <Input id="root-category-input" placeholder="Add new root category" />
        <Button
          onClick={(e) => {
            e.preventDefault();
            const input = document.querySelector<HTMLInputElement>(
              "#root-category-input",
            );
            if (input?.value.trim()) {
              handleAddCategory(null, input.value.trim());
              input.value = "";
            }
          }}
        >
          Add
        </Button>
      </div>

      {/* Nested Category Accordion */}
      <CategoryAccordion
        categories={categories}
        onAddCategory={handleAddCategory}
        openAccordions={openAccordions}
        setOpenAccordions={handleAccordionToggle}
      />
    </div>
  );
}
