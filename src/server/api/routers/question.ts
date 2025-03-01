import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getQuestionsByProduct: protectedProcedure
    .input(z.string()) // Product ID
    .query(async ({ ctx, input }) => {
      return await ctx.db.question.findMany({
        where: { productId: input },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
    }),

  askQuestion: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        question: z.string().min(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
          question: input.question,
        },
      });
    }),

  answerQuestion: adminProcedure
    .input(
      z.object({
        questionId: z.string(),
        answer: z.string().min(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.update({
        where: { id: input.questionId },
        data: { answer: input.answer },
      });
    }),
});
