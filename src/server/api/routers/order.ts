import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const orderRouter = createTRPCRouter({
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.findMany({
      where: { userId: ctx.session.user.id },
      include: { items: { include: { product: true } }, address: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  getOrderById: protectedProcedure
    .input(z.string()) // Order ID
    .query(async ({ ctx, input }) => {
      return await ctx.db.order.findUnique({
        where: { id: input, userId: ctx.session.user.id },
        include: { items: { include: { product: true } }, address: true },
      });
    }),

  placeOrder: protectedProcedure
    .input(
      z.object({
        addressId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get user's cart
      const cart = await ctx.db.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // Get products for all cart items
      const products = await ctx.db.product.findMany({
        where: {
          id: {
            in: cart.items.map((item) => item.productId),
          },
        },
      });

      // Check stock availability
      for (const cartItem of cart.items) {
        const product = products.find((p) => p.id === cartItem.productId);
        if (!product) {
          throw new Error(`Product not found: ${cartItem.productId}`);
        }
        if (product.stock < cartItem.quantity) {
          throw new Error(`Insufficient stock for product: ${product.title}`);
        }
      }

      // Create a map of product prices
      const productPriceMap = new Map(
        products.map((product) => [product.id, product.price]),
      );

      // Calculate total price using product prices
      const total = cart.items.reduce(
        (acc, item) =>
          acc + item.quantity * (productPriceMap.get(item.productId) ?? 0),
        0,
      );

      // Start transaction
      const order = await ctx.db.$transaction(async (tx) => {
        // Update product stock
        for (const cartItem of cart.items) {
          await tx.product.update({
            where: { id: cartItem.productId },
            data: {
              stock: {
                decrement: cartItem.quantity,
              },
            },
          });
        }

        // Create order
        return await tx.order.create({
          data: {
            userId,
            total,
            addressId: input.addressId,
            items: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: productPriceMap.get(item.productId) ?? 0,
              })),
            },
          },
        });
      });

      // Clear cart after placing order
      await ctx.db.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    }),

  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum([
          "PENDING",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
      });
    }),

  cancelOrder: protectedProcedure
    .input(z.string()) // Order ID
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input, userId: ctx.session.user.id },
      });

      if (!order || order.status !== "PENDING") {
        throw new Error("Order cannot be cancelled");
      }

      return await ctx.db.order.update({
        where: { id: input },
        data: { status: "CANCELLED" },
      });
    }),

  deleteOrder: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.order.delete({ where: { id: input } });
    }),
});
