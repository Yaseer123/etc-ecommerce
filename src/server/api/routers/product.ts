import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { productSchema, updateProductSchema } from "@/schemas/productSchema";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

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

  getAllWithFilters: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        onSale: z.boolean().optional(),
        brand: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sort: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, onSale, brand, minPrice, maxPrice, sort } = input;
      
      // Use Prisma's type system for filters
      const filters: Prisma.ProductWhereInput = {};
      
      // Category filter with recursive children lookup
      if (categoryId) {
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

        const categoryIds = await getChildCategoryIds(categoryId);
        filters.categoryId = { in: categoryIds };
      }
      
      // Sale filter
      if (onSale === true) {
        filters.sale = true;
      }
      
      // Brand filter
      if (brand) {
        filters.brand = {
          equals: brand,
          mode: 'insensitive' as Prisma.QueryMode, // Case insensitive search with type assertion
        };
      }
      
      // Price range filter
      if (minPrice !== undefined || maxPrice !== undefined) {
        filters.price = {};
        
        if (minPrice !== undefined) {
          filters.price.gte = minPrice;
        }
        
        if (maxPrice !== undefined) {
          filters.price.lte = maxPrice;
        }
      }
      
      // Build sort options
      let orderBy: Prisma.ProductOrderByWithRelationInput | undefined;
      if (sort) {
        if (sort === 'priceHighToLow') {
          orderBy = { price: 'desc' };
        } else if (sort === 'priceLowToHigh') {
          orderBy = { price: 'asc' };
        }
      }
      
      // Fetch products with filters and sorting in a single query
      const products = await ctx.db.product.findMany({
        where: filters,
        include: { category: true },
        orderBy: orderBy,
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
