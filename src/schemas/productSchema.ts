import { z } from "zod";

// Product Schema for validation
export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().nullable(),
  price: z.number().positive("Price must be a positive number"),
  categoryId: z.string().cuid("Invalid category ID"),
});

export type Product = z.infer<typeof productSchema>;

export type ProductWithCategory = Product & {
  category: {
    name: string;
  };
};

// Update Product Schema
export const updateProductSchema = z.object({
  id: z.string().cuid("Invalid product ID"),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().cuid().optional(),
});

export type UpdateProduct = z.infer<typeof updateProductSchema>;
