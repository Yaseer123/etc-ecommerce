import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Product Schema for validation
const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  categoryId: z.string().cuid("Invalid category ID"),
});

// Update Product Schema
const updateProductSchema = z.object({
  id: z.string().cuid("Invalid product ID"),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().cuid().optional(),
});

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      include: { category: true },
    });

    return products;
  }),
  // Add a new product
  add: publicProcedure.input(productSchema).mutation(async ({ ctx, input }) => {
    const product = await ctx.db.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        categoryId: input.categoryId,
      },
    });

    return product;
  }),

  // Update an existing product
  update: publicProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const product = await ctx.db.product.update({
        where: { id },
        data: updateData,
      });

      return product;
    }),
});
