import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { productSchema, updateProductSchema } from "@/schemas/productSchema";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  getProductByIdAdmin: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: { category: true },
      });

      return product;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      include: { category: true },
    });

    return products;
  }),

  getAllByCategory: publicProcedure
  .input(
    z.object({
      categoryId: z.string().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    if (!input.categoryId) {
      return ctx.db.product.findMany({
        include: { category: true },
      });
    }

    // Fetch all child category IDs recursively
    const getChildCategoryIds = async (
      parentId: string,
    ): Promise<string[]> => {
      const subcategories = await ctx.db.category.findMany({
        where: { parentId },
        select: { id: true },
      });

      const childIds = subcategories.map((subcategory) => subcategory.id);
      const nestedChildIds = await Promise.all(
        childIds.map((id) => getChildCategoryIds(id)),
      );

      return [parentId, ...nestedChildIds.flat()];
    };

    const categoryIds = await getChildCategoryIds(input.categoryId);

    // Fetch products for all category IDs
    const products = await ctx.db.product.findMany({
      where: { categoryId: { in: categoryIds } },
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
        include: { category: true },
      });

      return product;
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
        images: input.images,
        descriptionImageId: input.descriptionImageId,
        stock: input.stock, // Add default stock value
        originPrice: input.price, // Set origin price same as price
        brand: input.brand, // Set default brand
        attributes: input.attributes, // Store JSON specifications
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
