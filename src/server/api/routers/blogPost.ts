import {
  adminProcedure,
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

  getAllPretty: publicProcedure.query(async ({ ctx }) => {
    const blogPost = await ctx.db.post.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

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
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return post;
    }),

  // Add a new blog post
  add: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        slug: z.string().min(1, "Slug field can't be empty"),
        shortDescription: z.string(),
        coverImageId: z.string(),
        coverImageUrl: z.string(),
        content: z.string(),
        createdBy: z.string(),
        imageId: z.string(),
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          imageId: input.imageId,
          coverImageId: input.coverImageId,
          coverImageUrl: input.coverImageUrl,
          shortDescription: input.shortDescription,
          title: input.title,
          slug: input.slug,
          content: input.content,
          createdById: input.createdBy,
          tags: input.tags,
        },
      });

      return post;
    }),

  edit: adminProcedure
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

  delete: adminProcedure
    .input(
      z.object({
        userId: z.string().cuid("Invalid user id"),
        blogId: z.string().cuid("Invalid blog id"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.delete({
        where: { createdById: input.userId, id: input.blogId },
      });
    }),
});
