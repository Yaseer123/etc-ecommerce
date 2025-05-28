import { type CategoryAttribute } from "@/schemas/categorySchema";
import { productSchema, updateProductSchema } from "@/schemas/productSchema";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { validateCategoryAttributes } from "@/utils/validateCategoryAttributes";
import type { Prisma } from "@prisma/client";
import { StockStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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

  getAllWithFilters: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        onSale: z.boolean().optional(),
        brands: z.array(z.string()).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sort: z.string().optional(),
        attributes: z
          .record(z.union([z.string(), z.array(z.string())]))
          .optional(),
        stockStatus: z
          .array(z.enum(["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER"]))
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        categoryId,
        onSale,
        brands,
        minPrice,
        maxPrice,
        sort,
        attributes,
        stockStatus,
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

      // Brand filter - updated for multiple brands
      if (brands && brands.length > 0) {
        filters.brand = {
          in: brands,
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

      // Add attribute filters if provided - Updated for multiple selection support
      if (attributes && Object.keys(attributes).length > 0) {
        Object.entries(attributes).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (!filters.AND) {
              filters.AND = [];
            } else if (!Array.isArray(filters.AND)) {
              filters.AND = [filters.AND];
            }

            if (Array.isArray(value)) {
              // Multiple values selected - any match is valid (OR condition)
              const orConditions = value.map((val) => ({
                categoryAttributes: {
                  path: [key],
                  equals: val,
                },
              }));

              filters.AND.push({ OR: orConditions });
            } else {
              // Single value selected
              filters.AND.push({
                categoryAttributes: {
                  path: [key],
                  equals: value,
                },
              });
            }
          }
        });
      }

      // Stock status filter (based on stock number)
      if (stockStatus && stockStatus.length > 0) {
        const orConditions = [];
        if (stockStatus.includes("OUT_OF_STOCK")) {
          orConditions.push({ stock: 0 });
        }
        if (stockStatus.includes("IN_STOCK")) {
          orConditions.push({ stock: { gt: 0 } });
        }
        if (stockStatus.includes("PRE_ORDER")) {
          orConditions.push({ stockStatus: { equals: StockStatus.PRE_ORDER } });
        }
        if (orConditions.length === 1) {
          Object.assign(filters, orConditions[0]);
        } else if (orConditions.length > 1) {
          if (!filters.AND) filters.AND = [];
          if (!Array.isArray(filters.AND)) filters.AND = [filters.AND];
          filters.AND.push({ OR: orConditions });
        }
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
    const { categoryAttributes, categoryId } = input;

    // Get category details to validate attributes
    if (categoryId) {
      const category = await ctx.db.category.findUnique({
        where: { id: categoryId },
        select: { attributes: true },
      });

      if (category) {
        // Parse the category attributes
        let categoryAttributeDefinitions: CategoryAttribute[] = [];

        try {
          if (typeof category.attributes === "string") {
            categoryAttributeDefinitions = JSON.parse(
              category.attributes,
            ) as CategoryAttribute[];
          } else if (Array.isArray(category.attributes)) {
            categoryAttributeDefinitions =
              category.attributes as CategoryAttribute[];
          }

          // Validate that the product satisfies the category's required attributes
          const validation = validateCategoryAttributes(
            categoryAttributes || {},
            categoryAttributeDefinitions,
          );

          if (!validation.isValid) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Category attribute validation failed: ${validation.errors.join(", ")}`,
            });
          }
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Failed to parse category attributes:", error);
        }
      }
    }

    // --- Stock status auto logic ---
    let stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER" = "IN_STOCK";
    if ("stockStatus" in input && input.stockStatus === "PRE_ORDER") {
      stockStatus = "PRE_ORDER";
    } else if (input.stock === 0) {
      stockStatus = "OUT_OF_STOCK";
    } else {
      stockStatus = "IN_STOCK";
    }
    // --- End stock status auto logic ---

    // Create the product with validated attributes
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
        discountedPrice: input.discountedPrice,
        brand: input.brand,
        estimatedDeliveryTime: input.estimatedDeliveryTime,
        attributes: input.attributes, // Store regular specifications
        categoryAttributes: categoryAttributes || {}, // Store category-specific attributes
        stockStatus, // <-- always set
      },
    });

    return product;
  }),

  update: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, categoryId, categoryAttributes, ...updateData } = input;

      // If category or attributes are being updated, validate them
      if (categoryId && categoryAttributes) {
        const category = await ctx.db.category.findUnique({
          where: { id: categoryId },
          select: { attributes: true },
        });

        if (category) {
          // Parse the category attributes
          let categoryAttributeDefinitions: CategoryAttribute[] = [];
          try {
            if (typeof category.attributes === "string") {
              categoryAttributeDefinitions = JSON.parse(
                category.attributes,
              ) as CategoryAttribute[];
            } else if (Array.isArray(category.attributes)) {
              categoryAttributeDefinitions =
                category.attributes as CategoryAttribute[];
            }

            // Validate that the product satisfies the category's required attributes
            const validation = validateCategoryAttributes(
              categoryAttributes || {},
              categoryAttributeDefinitions,
            );

            if (!validation.isValid) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Category attribute validation failed: ${validation.errors.join(", ")}`,
              });
            }
          } catch (error) {
            if (error instanceof TRPCError) throw error;
            console.error("Failed to parse category attributes:", error);
          }
        }
      }

      // --- Stock status auto logic ---
      let stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER" | undefined =
        undefined;
      if ("stockStatus" in input && input.stockStatus === "PRE_ORDER") {
        stockStatus = "PRE_ORDER";
      } else if (typeof input.stock === "number") {
        if (input.stock === 0) {
          stockStatus = "OUT_OF_STOCK";
        } else {
          stockStatus = "IN_STOCK";
        }
      }
      // --- End stock status auto logic ---

      const product = await ctx.db.product.update({
        where: { id },
        data: {
          ...updateData,
          categoryAttributes: categoryAttributes ?? {}, // Update category attributes separately
          category: categoryId ? { connect: { id: categoryId } } : undefined,
          ...(stockStatus ? { stockStatus } : {}),
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

      // Get products with their categoryAttributes (updated from attributes)
      const products = await ctx.db.product.findMany({
        where: {
          categoryId: { in: categoryIds },
        },
        select: {
          categoryAttributes: true, // Select categoryAttributes directly
        },
      });

      // Extract available values for each attribute
      const attributeValues: Record<string, Set<string>> = {}; // Only string values now

      // For each product, extract attribute values directly from categoryAttributes
      products.forEach((product) => {
        if (!product.categoryAttributes) return;

        const attrs = product.categoryAttributes as Record<string, unknown>;
        Object.entries(attrs).forEach(([key, value]) => {
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
