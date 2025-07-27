import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestLinkedProducts() {
  try {
    // Create a test category
    const category = await prisma.category.create({
      data: {
        name: "Air Conditioners",
        attributes: JSON.stringify([
          {
            name: "Cooling Capacity",
            type: "select",
            required: true,
            options: ["1 Ton", "1.5 Ton", "2 Ton", "2.5 Ton"],
          },
        ]),
      },
    });

    // Create test products with different ton capacities
    const product1 = await prisma.product.create({
      data: {
        title: "Premium Air Conditioner 1 Ton",
        slug: "premium-ac-1-ton",
        shortDescription: "High efficiency 1 ton air conditioner",
        description: "Premium 1 ton air conditioner with advanced features",
        price: 25000,
        stock: 10,
        brand: "CoolTech",
        defaultTon: "1 Ton",
        categoryId: category.id,
        imageId: "test-image-1",
        images: ["https://via.placeholder.com/500x500?text=1+Ton+AC"],
        published: true,
      },
    });

    const product2 = await prisma.product.create({
      data: {
        title: "Premium Air Conditioner 1.5 Ton",
        slug: "premium-ac-1-5-ton",
        shortDescription: "High efficiency 1.5 ton air conditioner",
        description: "Premium 1.5 ton air conditioner with advanced features",
        price: 35000,
        stock: 8,
        brand: "CoolTech",
        defaultTon: "1.5 Ton",
        categoryId: category.id,
        imageId: "test-image-2",
        images: ["https://via.placeholder.com/500x500?text=1.5+Ton+AC"],
        published: true,
      },
    });

    const product3 = await prisma.product.create({
      data: {
        title: "Premium Air Conditioner 2 Ton",
        slug: "premium-ac-2-ton",
        shortDescription: "High efficiency 2 ton air conditioner",
        description: "Premium 2 ton air conditioner with advanced features",
        price: 45000,
        stock: 5,
        brand: "CoolTech",
        defaultTon: "2 Ton",
        categoryId: category.id,
        imageId: "test-image-3",
        images: ["https://via.placeholder.com/500x500?text=2+Ton+AC"],
        published: true,
      },
    });

    // Link the products together
    await prisma.product.update({
      where: { id: product1.id },
      data: {
        relatedTonProducts: {
          connect: [{ id: product2.id }, { id: product3.id }],
        },
      },
    });

    await prisma.product.update({
      where: { id: product2.id },
      data: {
        relatedTonProducts: {
          connect: [{ id: product1.id }, { id: product3.id }],
        },
      },
    });

    await prisma.product.update({
      where: { id: product3.id },
      data: {
        relatedTonProducts: {
          connect: [{ id: product1.id }, { id: product2.id }],
        },
      },
    });

    console.log("Test products created successfully!");
    console.log("Product 1:", product1.slug);
    console.log("Product 2:", product2.slug);
    console.log("Product 3:", product3.slug);
    console.log(
      "You can now test the linked products functionality by visiting:",
    );
    console.log(`http://localhost:3000/products/${product1.slug}`);
    console.log(`http://localhost:3000/products/${product2.slug}`);
    console.log(`http://localhost:3000/products/${product3.slug}`);
  } catch (error) {
    console.error("Error creating test products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestLinkedProducts().catch(console.error);
