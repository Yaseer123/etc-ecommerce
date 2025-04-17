"use client";

import { CategoryAccordion } from "./CategoryAccordion";
import { api } from "@/trpc/react";

export default function CategoryAccordionManager() {
  const { data: categories, error, isLoading } = api.category.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!categories || categories.length === 0)
    return <div>No categories found</div>;

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
