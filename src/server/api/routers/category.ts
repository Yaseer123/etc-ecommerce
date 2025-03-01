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
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return buildCategoryTree(categories);
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.create({
        data: {
          name: input.name,
          parentId: input.parentId ?? null,
        },
      });

      return category;
    }),

  edit: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.update({
        where: { id: input.id },
        data: { name: input.name },
      });

      return category;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.category.delete({ where: { id: input.id } });
    }),
});
