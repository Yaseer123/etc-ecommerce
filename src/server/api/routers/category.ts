import type { Category, CategoryTree } from "@/schemas/categorySchema";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

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
      const hierarchy = [];
      let currentCategory = await ctx.db.category.findUnique({
        where: { id: input.id },
        select: { id: true, name: true, parentId: true },
      });

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
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return buildCategoryTree(categories);
  }),

  getAllParent: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      where: { parentId: null },
      orderBy: { updatedAt: "desc" },
    });

    return categories;
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id },
      });

      return category;
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
      // Create the category in the database
      const category = await ctx.db.category.create({
        data: {
          name: input.name,
          parentId: input.parentId ?? null,
          imageId: input.imageId,
          image: input.imageUrl,
        },
      });

      return category;
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
      const category = await ctx.db.category.update({
        where: { id: input.id },
        data: { name: input.name, imageId: input.imageId, image: input.image },
      });

      return category;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.category.delete({ where: { id: input.id } });
    }),
});
