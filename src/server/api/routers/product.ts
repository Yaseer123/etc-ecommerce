import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { productSchema, updateProductSchema } from "@/schemas/productSchema";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      include: { category: true },
    });

    return products;
  }),

  getProductById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
      });

      return product;
    }),

  getProductWithCategoryName: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    return products;
  }),

  add: adminProcedure.input(productSchema).mutation(async ({ ctx, input }) => {
    const product = await ctx.db.product.create({
      data: {
        title: input.title,
        shortDescription: input.shortDescription,
        slug: input.slug,
        description: input.description,
        price: input.price,
        categoryId: input.categoryId,
        imageId: input.imageId,
        descriptionImageId: input.descriptionImageId,
        stock: 0, // Add default stock value
      },
    });

    return product;
  }),

  update: adminProcedure
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
