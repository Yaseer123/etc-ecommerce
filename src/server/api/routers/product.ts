import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { productSchema, updateProductSchema } from "@/schemas/productSchema";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      include: { category: true },
    });

    return products;
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
  // Add a new product
  add: protectedProcedure
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
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
        },
      });

      return product;
    }),

  // Update an existing product
  update: protectedProcedure
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
