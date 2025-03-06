import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prettifyProduct } from "./product";

export const wishListRouter = createTRPCRouter({
  getWishList: protectedProcedure.query(async ({ ctx }) => {
    const wishLists = await ctx.db.wishList.findMany({
      where: { userId: ctx.session.user.id },
      include: { product: true },
    });

    const prettifiedWishList = wishLists.map((wishList) =>
      prettifyProduct(wishList.product),
    );
    return await Promise.all(prettifiedWishList);
  }),

  addToWishList: protectedProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.wishList.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      });
    }),

  removeFromWishList: protectedProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.wishList.deleteMany({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      });
    }),
});
