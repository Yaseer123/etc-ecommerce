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
        title: z.string().min(3, "Title must be at least 3 characters"),
        slug: z.string().min(1, "Slug field can't be empty"),
        content: z.string(),
        createdBy: z.string(),
        imageId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          imageId: input.imageId,
          title: input.title,
          slug: input.slug,
          content: input.content,
          createdById: input.createdBy,
        },
      });

      return post;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid("Invalid post ID"),
        title: z.string().min(3, "Title must be at least 3 characters"),
        slug: z.string().min(1, "Slug field can't be empty"),
        content: z.string(),
        createdBy: z.string(),
        imageId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.update({
        where: { id: input.id },
        data: {
          imageId: input.imageId,
          title: input.title,
          slug: input.slug,
          content: input.content,
          createdById: input.createdBy,
        },
      });

      return post;
    }),
});
