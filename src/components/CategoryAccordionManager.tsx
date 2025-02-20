"use client";

import { CategoryAccordion } from "./CategoryAccordion";
import { api } from "@/trpc/react";

export default function CategoryAccordionManager() {
  const [categories] = api.category.getAll.useSuspenseQuery();

  const utils = api.useUtils();
  const deleteCategory = api.category.delete.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
    },
  });

  const handleDelete = (id: string) => {
    deleteCategory.mutate({ id });
  };

  return (
    <div className="w-full space-y-4 lg:w-5/12">
      <h2 className="text-xl font-bold">Categories</h2>
      <CategoryAccordion categories={categories} onDelete={handleDelete} />
    </div>
  );
}
