"use client";

import { CategoryAccordion } from "./CategoryAccordion";
import { api } from "@/trpc/react";

export default function CategoryAccordionManager() {
  const [categories] = api.category.getAll.useSuspenseQuery();

  return (
    <div className="w-full lg:w-5/12">
      <CategoryAccordion categories={categories} />
    </div>
  );
}
