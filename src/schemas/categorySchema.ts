import { type Category as PrismaCategory } from "@prisma/client";
import { z } from "zod";

// Category Schema for validation
export const newCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  parentId: z.string().nullable(),
  image: z.instanceof(File).optional(),
});

// TypeScript Type for Category
export type NewCategory = z.infer<typeof newCategorySchema>;

export type Category = PrismaCategory;

export interface CategoryTree extends Category {
  subcategories: CategoryTree[];
}
