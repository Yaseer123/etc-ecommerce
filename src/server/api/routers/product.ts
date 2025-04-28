import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { productSchema, updateProductSchema } from "@/schemas/productSchema";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import type { CategoryAttribute } from "@/schemas/categorySchema";
import { TRPCError } from "@trpc/server";

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
        attributes: z
          .record(z.string(), z.union([z.string(), z.array(z.string())]))
          .optional(), // Only string or string[] for select attributes
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        categoryId,
        onSale,
        brand,
        minPrice,
        maxPrice,
        sort,
        attributes,
      } = input;

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
          mode: "insensitive" as Prisma.QueryMode, // Case insensitive search with type assertion
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

      // Add attribute filters if provided - updated for only select attributes
      if (attributes && Object.keys(attributes).length > 0) {
        // For each attribute, create a filter
        Object.entries(attributes).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            // Make sure filters.AND is always an array
            if (!filters.AND) {
              filters.AND = [];
            } else if (!Array.isArray(filters.AND)) {
              filters.AND = [filters.AND];
            }

            if (Array.isArray(value)) {
              // Multi-select: handle array of options
              const orConditions = value.map((val) => ({
                attributes: {
                  path: ["categoryAttributes", key],
                  equals: val,
                },
              }));
              filters.AND.push({ OR: orConditions });
            } else {
              // Single select: handle single string option
              filters.AND.push({
                attributes: {
                  path: ["categoryAttributes", key],
                  equals: value,
                },
              });
            }
          }
        });
      }

      // Build sort options
      let orderBy: Prisma.ProductOrderByWithRelationInput | undefined;
      if (sort) {
        if (sort === "priceHighToLow") {
          orderBy = { price: "desc" };
        } else if (sort === "priceLowToHigh") {
          orderBy = { price: "asc" };
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

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query } = input;

      const products = await ctx.db.product.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              shortDescription: {
                contains: query,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              brand: {
                contains: query,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              slug: {
                contains: query,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        },
        include: { category: true },
      });

      return products;
    }),

  add: adminProcedure.input(productSchema).mutation(async ({ ctx, input }) => {
    // Merge specifications and attributeValues into the attributes JSON field
    const attributesData = {
      ...input.attributes,
    };

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
        stock: input.stock,
        originPrice: input.originPrice,
        brand: input.brand,
        estimatedDeliveryTime: input.estimatedDeliveryTime,
        attributes: attributesData, // Store both regular attributes and category attributes
      },
    });

    return product;
  }),

  update: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, categoryId, ...updateData } = input;

      const product = await ctx.db.product.update({
        where: { id },
        data: {
          ...updateData,
          category: categoryId ? { connect: { id: categoryId } } : undefined,
        },
      });

      return product;
    }),

  getPriceRange: publicProcedure.query(async ({ ctx }) => {
    // Find the lowest priced product
    const minPriceProduct = await ctx.db.product.findFirst({
      orderBy: {
        price: "asc",
      },
      select: {
        price: true,
      },
    });

    // Find the highest priced product
    const maxPriceProduct = await ctx.db.product.findFirst({
      orderBy: {
        price: "desc",
      },
      select: {
        price: true,
      },
    });

    return {
      min: minPriceProduct?.price ?? 0,
      max: maxPriceProduct?.price ?? 1000,
    };
  }),

  getBrandsByCategory: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { categoryId } = input;

      if (!categoryId) {
        // If no category is selected, return all unique brands
        const allProducts = await ctx.db.product.findMany({
          select: { brand: true },
        });

        const uniqueBrands = Array.from(
          new Set(allProducts.map((product) => product.brand.toLowerCase())),
        ).sort();

        return uniqueBrands;
      }

      // Get all subcategory IDs recursively for the selected category
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

      // Get products for the selected category and its subcategories
      const products = await ctx.db.product.findMany({
        where: {
          categoryId: { in: categoryIds },
        },
        select: {
          brand: true,
        },
      });

      // Extract unique brands and sort them
      const uniqueBrands = Array.from(
        new Set(products.map((product) => product.brand.toLowerCase())),
      ).sort();

      return uniqueBrands;
    }),

  // Add a new procedure to get category attributes for filtering
  getCategoryAttributes: publicProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { categoryId } = input;

      // Get the category to access its attribute definitions
      const category = await ctx.db.category.findUnique({
        where: { id: categoryId },
        select: {
          attributes: true,
        },
      });

      if (!category) {
        return [];
      }

      // Parse the attributes - ensure they conform to the CategoryAttribute type
      let attributeDefinitions: CategoryAttribute[] = [];
      try {
        if (typeof category.attributes === "string") {
          const parsed = JSON.parse(category.attributes) as unknown[];
          // Filter to only include "select" type attributes
          attributeDefinitions = Array.isArray(parsed)
            ? parsed.filter(
                (attr): attr is CategoryAttribute =>
                  typeof attr === "object" &&
                  attr !== null &&
                  "type" in attr &&
                  attr.type === "select",
              )
            : [];
        } else if (Array.isArray(category.attributes)) {
          // Filter to only include "select" type attributes
          attributeDefinitions = category.attributes.filter(
            (attr): attr is CategoryAttribute =>
              typeof attr === "object" &&
              attr !== null &&
              "type" in attr &&
              attr.type === "select",
          );
        }
      } catch (error) {
        console.error("Failed to parse category attributes:", error);
        return [];
      }

      // Get all products in this category to extract available attribute values
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

      // Get products with their attributes
      const products = await ctx.db.product.findMany({
        where: {
          categoryId: { in: categoryIds },
        },
        select: {
          attributes: true,
        },
      });

      // Extract available values for each attribute
      const attributeValues: Record<string, Set<string>> = {}; // Only string values now

      // For each product, extract attribute values
      products.forEach((product) => {
        if (!product.attributes) return;

        const attrs = product.attributes as Record<string, unknown>;
        if (attrs.categoryAttributes) {
          Object.entries(attrs.categoryAttributes).forEach(([key, value]) => {
            if (!attributeValues[key]) {
              attributeValues[key] = new Set();
            }

            // Only handle string values or arrays of strings
            if (typeof value === "string") {
              attributeValues[key].add(value);
            } else if (Array.isArray(value)) {
              value.forEach((v) => {
                if (typeof v === "string") {
                  // Re-check existence since we're inside a closure
                  if (!attributeValues[key]) {
                    attributeValues[key] = new Set();
                  }
                  attributeValues[key].add(v);
                }
              });
            }
          });
        }
      });

      // Combine attribute definitions with available values
      const resultAttributes = attributeDefinitions.map((attr) => {
        // Get available values for this attribute
        const values = attributeValues[attr.name];
        const availableValues = values ? Array.from(values) : [];

        return {
          ...attr,
          availableValues: attr.options?.length
            ? attr.options
            : availableValues,
        };
      });

      return resultAttributes;
    }),

  updateStockStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, stockStatus } = input;

      // Ensure the user is an admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update product status",
        });
      }

      return ctx.db.product.update({
        where: { id },
        data: { stockStatus },
      });
    }),

  delete: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Delete the product
      return ctx.db.product.delete({
        where: { id },
      });
    }),

  // Add these procedures to your product router

  getFeaturedProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(4),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: {
          featured: true,
          published: true,
        },
        take: input.limit,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  updateFeaturedStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        featured: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.update({
        where: {
          id: input.id,
        },
        data: {
          featured: input.featured,
        },
      });
    }),
});
