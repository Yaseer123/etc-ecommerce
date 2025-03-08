import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prettifyProduct } from "./product";

export const wishListRouter = createTRPCRouter({
  getWishList: protectedProcedure.query(async ({ ctx }) => {
    console.log("🔹 [getWishList] Session:", ctx.session);

    try {
      console.log("🔹 Fetching wishlist for user:", ctx.session.user.id);

      const wishLists = await ctx.db.wishList.findMany({
        where: { userId: ctx.session.user.id },
        include: { product: true },
      });

      console.log("✅ Raw WishList Data:", wishLists);

      const prettifiedWishList = wishLists.map((wishList) =>
        prettifyProduct(wishList.product),
      );

      const finalWishList = await Promise.all(prettifiedWishList);
      console.log("✅ Prettified WishList:", finalWishList);

      return finalWishList;
    } catch (error) {
      console.error("🔥 [getWishList] Error:", error);
      throw new Error("Internal Server Error");
    }
  }),

  addToWishList: protectedProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      console.log("🔹 [addToWishList] Adding Product ID:", input.productId);

      try {
        const newWishListItem = await ctx.db.wishList.create({
          data: {
            userId: ctx.session.user.id,
            productId: input.productId,
          },
        });

        console.log("✅ [addToWishList] Added:", newWishListItem);
        return newWishListItem;
      } catch (error) {
        console.error("🔥 [addToWishList] Error:", error);
        throw new Error("Failed to add to wishlist");
      }
    }),

  removeFromWishList: protectedProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      console.log(
        "🔹 [removeFromWishList] Removing Product ID:",
        input.productId,
      );

      try {
        const deletedWishList = await ctx.db.wishList.deleteMany({
          where: {
            userId: ctx.session.user.id,
            productId: input.productId,
          },
        });

        console.log("✅ [removeFromWishList] Removed:", deletedWishList);
        return deletedWishList;
      } catch (error) {
        console.error("🔥 [removeFromWishList] Error:", error);
        throw new Error("Failed to remove from wishlist");
      }
    }),
});
