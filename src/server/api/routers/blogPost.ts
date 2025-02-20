import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const blogPostRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const blogPost = await ctx.db.post.findMany();

    return blogPost;
  }),

  getOne: publicProcedure
    .input(
      z.object({
        id: z.string().cuid("Invalid post ID"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      });

      return post;
    }),

  // Add a new blog post
  add: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        createdBy: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          title: input.title,
          slug: input.slug,
          content: input.content,
          createdById: input.createdBy,
        },
      });

      return post;
    }),
});
