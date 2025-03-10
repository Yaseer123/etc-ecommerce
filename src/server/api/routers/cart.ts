import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
      include: { items: { include: { product: true } } },
    });
  }),

  addToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string().cuid(),
        quantity: z.number().int().min(1).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const stock = await ctx.db.product.findUnique({
        where: { id: input.productId },
        select: { stock: true },
      });

      if (!stock) {
        return { success: false, message: "Cart cleared" };
      }

      if (stock.stock < input.quantity) {
        return { success: false, message: "Cart cleared" };
      }

      const cart = await ctx.db.cart.findUnique({
        where: { userId: ctx.session.user.id },
        include: { items: true },
      });

      if (!cart) {
        return await ctx.db.cart.create({
          data: {
            userId: ctx.session.user.id,
            items: {
              create: {
                quantity: input.quantity,
                productId: input.productId,
              },
            },
          },
        });
      }

      const item = cart.items.find(
        (item) => item.productId === input.productId,
      );

      // if (item) {
      //   return await ctx.db.cartItem.update({
      //     where: { id: item.id },
      //     data: { quantity: item.quantity + input.quantity },
      //   });
      // }

      if (item) return;

      return await ctx.db.cartItem.create({
        data: {
          quantity: input.quantity,
          productId: input.productId,
          cartId: cart.id,
        },
      });
    }),

  removeFromCart: protectedProcedure
    .input(z.string()) // Item ID
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.cartItem.delete({
        where: { id: input },
      });
    }),

  updateCartItem: protectedProcedure
    .input(
      z.object({
        cartItemId: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.cartItem.update({
        where: { id: input.cartItemId },
        data: { quantity: input.quantity },
      });
    }),

  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const cart = await ctx.db.cart.findUnique({
      where: { userId },
    });

    if (!cart) return { success: false, message: "Cart not found" };

    await ctx.db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { success: true, message: "Cart cleared" };
  }),
});
