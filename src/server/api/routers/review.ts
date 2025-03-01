import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  getReviewsByProduct: protectedProcedure
    .input(z.string()) // Product ID
    .query(async ({ ctx, input }) => {
      return await ctx.db.review.findMany({
        where: { productId: input },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
    }),

  addReview: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.review.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
          rating: input.rating,
          comment: input.comment,
        },
      });
    }),

  deleteReview: adminProcedure
    .input(z.string()) // Review ID
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.review.delete({
        where: { id: input },
      });
    }),
});
