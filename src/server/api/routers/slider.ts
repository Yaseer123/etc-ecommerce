import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

const sliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Valid image URL is required"),
  imageId: z.string().min(1, "Cloudinary ID is required"),
  link: z.string().url("Valid link URL is required"),
});

export const sliderRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.slider.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  add: adminProcedure.input(sliderSchema).mutation(async ({ ctx, input }) => {
    return await ctx.db.slider.create({
      data: input,
    });
  }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        ...sliderSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.slider.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.slider.delete({
        where: { id: input.id },
      });
    }),
});
