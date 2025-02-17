import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type Category } from "@prisma/client";
import { z } from "zod";

export interface CategoryTree extends Category {
  subcategories: CategoryTree[];
}

const buildCategoryTree = (
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
      orderBy: { createdAt: "asc" },
    });

    return buildCategoryTree(categories);
  }),

  add: protectedProcedure
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
});
