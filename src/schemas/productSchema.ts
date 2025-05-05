import { z } from "zod";

// Define a schema for category attribute values
// This is more flexible than the full category attribute definition
export const categoryAttributeValueSchema = z.record(
  z.string(), // The attribute name
  z.union([z.string(), z.number(), z.boolean()]), // Possible values
);

export const productSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  shortDescription: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  originPrice: z.number().optional(),
  stock: z.number().int().nonnegative(),
  brand: z.string(),
  imageId: z.string(),
  images: z.array(z.string()),
  categoryId: z.string(),
  descriptionImageId: z.string().optional(),
  attributes: z.record(z.string(), z.string()).default({}),
  estimatedDeliveryTime: z.number().int().positive().optional(),
  categoryAttributes: categoryAttributeValueSchema.default({}), // Add categoryAttributes field
});

export const updateProductSchema = z.object({
  id: z.string(),
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  shortDescription: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  originPrice: z.number().optional(),
  stock: z.number().int().nonnegative().optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  descriptionImageId: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
  estimatedDeliveryTime: z.number().int().positive().optional(),
  categoryAttributes: categoryAttributeValueSchema.optional(), // Add categoryAttributes field
});

export type Product = z.infer<typeof productSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
