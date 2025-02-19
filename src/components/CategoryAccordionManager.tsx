"use client";

import { CategoryAccordion } from "./CategoryAccordion";
import { api } from "@/trpc/react";

export default function CategoryAccordionManager() {
  const [categories] = api.category.getAll.useSuspenseQuery();

  return (
    <div className="w-full space-y-4 lg:w-5/12">
      <h2 className="text-xl font-bold">Categories</h2>
      <CategoryAccordion categories={categories} />
    </div>
  );
}
