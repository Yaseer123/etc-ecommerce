import { z } from "zod";

// Product Schema for validation
export const productSchema = z.object({
  title: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  shortDescription: z
    .string()
    .min(2, "Short description must be at least 2 characters"),
  description: z.string().nullable(),
  price: z.number().positive("Price must be a positive number"),
  categoryId: z.string().cuid("Invalid category ID"),
  imageId: z.string().uuid("Invalid image ID"),
  descriptionImageId: z
    .string()
    .uuid("Invalid description image ID")
    .optional(),
  attributes: z.record(z.string(), z.string()).optional(), // JSON specifications
  images: z.string().array().optional(),
  stock: z.number(),
  brand: z.string(),
});

export type Product = z.infer<typeof productSchema>;

// Update Product Schema
export const updateProductSchema = z.object({
  id: z.string().cuid("Invalid product ID"),
  title: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  shortDescription: z
    .string()
    .min(2, "Short description must be at least 2 characters"),
  description: z.string().nullable(),
  price: z.number().positive("Price must be a positive number"),
  categoryId: z.string().cuid("Invalid category ID"),
  imageId: z.string().uuid("Invalid image ID"),
  descriptionImageId: z
    .string()
    .uuid("Invalid description image ID")
    .optional(),
  attributes: z.record(z.string(), z.string()).optional(), // JSON specifications
  images: z.string().array().optional(),
  stock: z.number(),
  published: z.boolean(),
});

export type UpdateProduct = z.infer<typeof updateProductSchema>;
