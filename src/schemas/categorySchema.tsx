import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Category name is required"), // Ensures category name is not empty
  parentId: z.string().nullable(), // Recursive self-relation (Nullable)
  createdAt: z.date().default(() => new Date()), // Default to current date if not provided
  updatedAt: z.date().default(() => new Date()), // Auto-update timestamp
});

// TypeScript Type for Category
export type Category = z.infer<typeof categorySchema>;

export interface CategoryTree extends Category {
  subcategories: CategoryTree[];
}
