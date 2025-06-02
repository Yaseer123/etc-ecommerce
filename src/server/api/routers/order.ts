import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Resend } from "resend";
import { z } from "zod";

export const orderRouter = createTRPCRouter({
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.findMany({
      where: { userId: ctx.session.user.id },
      include: { items: { include: { product: true } }, address: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  getOrderbyStatus: protectedProcedure
    .input(
      z
        .enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.order.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input && { status: input }),
        },
        include: { items: { include: { product: true } }, address: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  getLatestOrder: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.findFirst({
      where: { userId: ctx.session.user.id },
      include: { items: { include: { product: true } }, address: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  getOrderById: protectedProcedure
    .input(z.string()) // Order ID
    .query(async ({ ctx, input }) => {
      return await ctx.db.order.findUnique({
        where: { id: input },
        include: { items: { include: { product: true } }, address: true },
      });
    }),

  placeOrder: protectedProcedure
    .input(
      z.object({
        cartItems: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().min(1),
          }),
        ),
        addressId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get products for all cart items
      const products = await ctx.db.product.findMany({
        where: {
          id: {
            in: input.cartItems.map((item) => item.productId),
          },
        },
      });

      // Check stock availability
      for (const cartItem of input.cartItems) {
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
        products.map((product) => [product.id, product.discountedPrice]),
      );

      // Calculate total price using product prices
      const total = input.cartItems.reduce(
        (acc, item) =>
          acc + item.quantity * (productPriceMap.get(item.productId) ?? 0),
        0,
      );

      // Start transaction
      const order = await ctx.db.$transaction(async (tx) => {
        // Update product stock
        for (const cartItem of input.cartItems) {
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
              create: input.cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: productPriceMap.get(item.productId) ?? 0,
              })),
            },
          },
        });
      });

      // Backend logging for debugging address linkage
      console.log("Order created:", order);
      console.log("AddressId used:", input.addressId);

      // Send email notification to admin
      try {
        // Fetch address details if available
        let address = null;
        if (order.addressId) {
          address = await ctx.db.address.findUnique({
            where: { id: order.addressId },
          });
        }
        // Fetch user details
        const user = await ctx.db.user.findUnique({
          where: { id: order.userId },
        });
        const addressBlock = address
          ? `<div style="margin-bottom: 16px;">
                <strong>Shipping Address:</strong><br/>
                ${address.street}<br/>
                ${address.city}, ${address.state} ${address.zipCode}<br/>
                <strong>Mobile:</strong> ${address.phone}<br/>
                <strong>Email:</strong> ${address.email}
             </div>`
          : '<div style="margin-bottom: 16px;"><em>No address provided.</em></div>';
        const customerBlock = user
          ? `<div style="margin-bottom: 16px;">
                <strong>Customer Name:</strong> ${user.name ?? "N/A"}<br/>
                <strong>Customer Email:</strong> ${user.email ?? "N/A"}
             </div>`
          : "";
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background: #007b55; color: #fff; padding: 24px 32px;">
              <h2 style="margin: 0;">New Order Placed</h2>
            </div>
            <div style="padding: 24px 32px;">
              <p style="font-size: 16px;">A new order has been placed on Rinors Ecommerce Admin.</p>
              <div style="margin-bottom: 16px;"><strong>Order ID:</strong> ${order.id}</div>
              <div style="margin-bottom: 16px;"><strong>Total:</strong> ৳${order.total}</div>
              ${customerBlock}
              ${addressBlock}
              <p style="margin-top: 32px; color: #888; font-size: 13px;">Please process this order promptly.</p>
            </div>
          </div>
        `;
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "no-reply@rinors.com",
          to: "rinorscorporation@gmail.com",
          subject: "New Order Placed",
          html,
        });
      } catch (e) {
        // Optionally log error, but do not block order placement
        console.error("Failed to send order notification email", e);
      }

      // Send confirmation email to customer
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: order.userId },
        });
        if (user?.email) {
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div style="background: #222; color: #fff; padding: 24px 32px;">
                <h2 style="margin: 0;">Order Confirmed!</h2>
              </div>
              <div style="padding: 24px 32px;">
                <p>Hi${user.name ? ` ${user.name}` : ""},</p>
                <p>Thank you for your order. Your order has been <b>confirmed</b> and is being processed.</p>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Total:</strong> ৳${order.total}</p>
                <p style="margin-top: 32px; color: #888; font-size: 13px;">If you have any questions, reply to this email.</p>
              </div>
            </div>
          `;
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "no-reply@rinors.com",
            to: user.email,
            subject: "Your order is confirmed!",
            html,
          });
        }
      } catch (e) {
        console.error("Failed to send order confirmation email to customer", e);
      }

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
      const updatedOrder = await ctx.db.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
        include: { user: true },
      });

      // Only send email for SHIPPED or CANCELLED
      if (input.status === "SHIPPED" || input.status === "CANCELLED") {
        try {
          const user = updatedOrder.user;
          if (user?.email) {
            let subject = "";
            let html = "";
            if (input.status === "SHIPPED") {
              subject = "Your order has been shipped!";
              html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                  <div style="background: #007b55; color: #fff; padding: 24px 32px;">
                    <h2 style="margin: 0;">Order Shipped!</h2>
                  </div>
                  <div style="padding: 24px 32px;">
                    <p>Hi${user.name ? ` ${user.name}` : ""},</p>
                    <p>Your order <b>${updatedOrder.id}</b> has been <b>shipped</b> and is on its way!</p>
                    <p><strong>Order ID:</strong> ${updatedOrder.id}</p>
                    <p><strong>Total:</strong> ৳${updatedOrder.total}</p>
                    <p style="margin-top: 32px; color: #888; font-size: 13px;">Thank you for shopping with us!</p>
                  </div>
                </div>
              `;
            } else if (input.status === "CANCELLED") {
              subject = "Your order has been cancelled";
              html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                  <div style="background: #007b55; color: #fff; padding: 24px 32px;">
                    <h2 style="margin: 0;">Order Cancelled</h2>
                  </div>
                  <div style="padding: 24px 32px;">
                    <p>Hi${user.name ? ` ${user.name}` : ""},</p>
                    <p>Your order <b>${updatedOrder.id}</b> has been <b>cancelled</b>.</p>
                    <p><strong>Order ID:</strong> ${updatedOrder.id}</p>
                    <p><strong>Total:</strong> ৳${updatedOrder.total}</p>
                    <p style="margin-top: 32px; color: #888; font-size: 13px;">If you have any questions, reply to this email.</p>
                  </div>
                </div>
              `;
            }
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: "no-reply@rinors.com",
              to: user.email,
              subject,
              html,
            });
          }
        } catch (e) {
          console.error("Failed to send order status update email", e);
        }
      }

      return updatedOrder;
    }),

  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),
});
