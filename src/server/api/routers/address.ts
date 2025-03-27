import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const addressRouter = createTRPCRouter({
  getAddress: protectedProcedure.query(async ({ ctx }) => {
    const address = await ctx.db.address.findUnique({
      where: { userId: ctx.session.user.id },
    });

    return address ?? null;
  }),

  updateAddress: protectedProcedure
    .input(
      z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zipCode: z.string().min(1),
        isDefault: z.boolean().optional(),
        phone: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedAddress = await ctx.db.address.upsert({
        where: { userId: ctx.session.user.id },
        update: { ...input },
        create: {
          ...input,
          userId: ctx.session.user.id,
        },
      });

      return updatedAddress;
    }),
});
