import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const questionRouter = createTRPCRouter({
  getQuestionsByProduct: publicProcedure
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

  // ADMIN: Get all questions with product and user info
  getAllQuestionsForAdmin: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.question.findMany({
      include: {
        user: { select: { name: true } },
        product: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // ADMIN: Delete a question
  deleteQuestion: adminProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.delete({
        where: { id: input.questionId },
      });
    }),
});
