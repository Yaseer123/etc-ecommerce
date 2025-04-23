import { z } from "zod";

// Define the attribute value schema
const attributeValueSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
);

export const productSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  shortDescription: z
    .string()
    .min(1, { message: "Short description is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  description: z.string().optional(),
  estimatedDeliveryTime: z.number().int().positive().optional(),
  price: z
    .number()
    .min(0, { message: "Price must be greater than or equal to 0" }),
  originPrice: z
    .number()
    .min(0, { message: "Origin price must be greater than or equal to 0" })
    .optional(),
  categoryId: z.string().optional(),
  imageId: z.string(),
  images: z.array(z.string()),
  descriptionImageId: z.string().optional(),
  attributes: z.record(z.string(), z.string()).default({}),
  attributeValues: attributeValueSchema.optional().default({}),
  stock: z
    .number()
    .min(0, { message: "Stock must be greater than or equal to 0" }),
  brand: z.string().min(1, { message: "Brand is required" }),
});

export type ProductInput = z.infer<typeof productSchema>;

export const updateProductSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, { message: "Title is required" }).optional(),
  shortDescription: z
    .string()
    .min(1, { message: "Short description is required" })
    .optional(),
  slug: z.string().min(1, { message: "Slug is required" }).optional(),
  description: z.string().optional(),
  estimatedDeliveryTime: z.number().int().positive().optional(),
  price: z
    .number()
    .min(0, { message: "Price must be greater than or equal to 0" })
    .optional(),
  originPrice: z
    .number()
    .min(0, { message: "Origin price must be greater than or equal to 0" })
    .optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).optional(),
  descriptionImageId: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
  attributeValues: attributeValueSchema.optional(),
  stock: z
    .number()
    .min(0, { message: "Stock must be greater than or equal to 0" })
    .optional(),
  brand: z.string().optional(),
  new: z.boolean().optional(),
  sale: z.boolean().optional(),
  published: z.boolean().optional(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
