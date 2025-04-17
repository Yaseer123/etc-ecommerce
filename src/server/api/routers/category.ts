import type { Category, CategoryTree } from "@/schemas/categorySchema";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const buildCategoryTree = (
  categories: Category[],
  parentId: string | null = null,
): CategoryTree[] => {
  return categories
    .filter((category) => category.parentId === parentId)
    .map((category) => ({
      ...category,
      subcategories: buildCategoryTree(categories, category.id),
    }));
};

export const categoryRouter = createTRPCRouter({
  getHierarchy: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const hierarchy = [];
        let currentCategory = await ctx.db.category.findUnique({
          where: { id: input.id },
          select: { id: true, name: true, parentId: true },
        });

        if (!currentCategory) {
          return [];
        }

        while (currentCategory) {
          hierarchy.unshift({
            id: currentCategory.id,
            name: currentCategory.name,
          });
          currentCategory = currentCategory.parentId
            ? await ctx.db.category.findUnique({
                where: { id: currentCategory.parentId },
                select: { id: true, name: true, parentId: true },
              })
            : null;
        }

        return hierarchy;
      } catch (error) {
        console.error("Error fetching category hierarchy:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch category hierarchy",
        });
      }
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.db.category.findMany({
        orderBy: { updatedAt: "desc" },
      });

      return buildCategoryTree(
        categories.map((cat) => ({
          ...cat,
          attributes:
            (cat.attributes as {
              name: string;
              type: "number" | "boolean" | "text" | "select";
              required: boolean;
              options?: string[];
            }[]) ?? [],
        })),
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch categories",
      });
    }
  }),

  getAllParent: publicProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.db.category.findMany({
        where: { parentId: null },
        orderBy: { updatedAt: "desc" },
      });

      return categories;
    } catch (error) {
      console.error("Error fetching parent categories:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch parent categories",
      });
    }
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.db.category.findUnique({
          where: { id: input.id },
        });

        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }

        return category;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error("Error fetching category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch category",
        });
      }
    }),

  add: adminProcedure
    .input(
      z.object({
        parentId: z.string().nullable(),
        name: z.string(),
        imageId: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const category = await ctx.db.category.create({
          data: {
            name: input.name,
            parentId: input.parentId ?? null,
            imageId: input.imageId,
            image: input.imageUrl,
          },
        });

        return category;
      } catch (error) {
        console.error("Error creating category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
        });
      }
    }),

  edit: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        imageId: z.string().nullable(),
        image: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const category = await ctx.db.category.update({
          where: { id: input.id },
          data: {
            name: input.name,
            imageId: input.imageId,
            image: input.image,
          },
        });

        return category;
      } catch (error) {
        console.error("Error updating category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update category",
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.category.delete({ where: { id: input.id } });
      } catch (error) {
        console.error("Error deleting category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete category",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.db.category.findUnique({
          where: { id: input.id },
        });

        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }

        return category;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error("Error fetching category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch category",
        });
      }
    }),

  updateAttributes: adminProcedure
    .input(
      z.object({
        id: z.string(),
        attributes: z.array(
          z.object({
            name: z.string(),
            type: z.enum(["text", "number", "boolean", "select"]),
            options: z.array(z.string()).optional(),
            required: z.boolean().default(false),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const category = await ctx.db.category.update({
          where: { id: input.id },
          data: { attributes: input.attributes },
        });

        return category;
      } catch (error) {
        console.error("Error updating category attributes:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update category attributes",
        });
      }
    }),
});
