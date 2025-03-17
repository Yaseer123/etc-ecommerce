import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { productSchema, updateProductSchema } from "@/schemas/productSchema";
import { z } from "zod";
import { readAllImages } from "@/app/actions/file";
import { type Category, type Product } from "@prisma/client";

interface ProductWithCategory extends Product {
  category?: Category;
}

export const prettifyProduct = async (product: ProductWithCategory) => {
  const images = await readAllImages(product.imageId);

  return {
    id: product.id,
    name: product.title,
    description: product.shortDescription,
    price: product.price,
    category: product.category?.name ?? "Default",
    new: product.new,
    sale: product.sale,
    rate: product.rate,
    originPrice: product.originPrice,
    thumbImage: images.slice(0, 2).map((image) => image.secure_url),
    images: images.map((image) => image.secure_url),
    slug: product.slug,
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    brand: "Default",
    sold: 0,
    quantity: product.stock,
    quantityPurchase: 1,
    action: "add to cart",
  };
};

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      include: { category: true },
    });

    return products;
  }),

  getAllPretty: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const products = input
        ? await ctx.db.product.findMany({
            where: { categoryId: input },
            include: { category: true },
          })
        : await ctx.db.product.findMany({
            include: { category: true },
          });

      const prettifiedProducts = products.map(async (product) =>
        prettifyProduct(product as ProductWithCategory),
      );

      return await Promise.all(prettifiedProducts);
    }),

  getProductById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
      });

      return product;
    }),

  getProductWithCategoryName: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    return products;
  }),

  add: adminProcedure.input(productSchema).mutation(async ({ ctx, input }) => {
    const product = await ctx.db.product.create({
      data: {
        title: input.title,
        shortDescription: input.shortDescription,
        slug: input.slug,
        description: input.description,
        price: input.price,
        categoryId: input.categoryId,
        imageId: input.imageId,
        descriptionImageId: input.descriptionImageId,
        stock: 10, // Add default stock value
        originPrice: input.price, // Set origin price same as price
        brand: "Default", // Set default brand
      },
    });

    return product;
  }),

  update: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const product = await ctx.db.product.update({
        where: { id },
        data: updateData,
      });

      return product;
    }),
});
