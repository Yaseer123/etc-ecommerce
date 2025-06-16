import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";
import ProductDetails from "@/components/store-components/Product/Details/ProductDetails";
import { api } from "@/trpc/server";
import type { ProductWithCategory, Variant } from "@/types/ProductType";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const productId = (await searchParams).id as string;

  if (!productId) {
    return {
      title: "Product",
      description: "Explore our latest products.",
    };
  }

  const productData = await api.product.getProductById({ id: productId });

  if (!productData) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  return {
    title: productData.title,
    description: productData.description,
    openGraph: {
      title: productData.title,
      description: productData.description,
      images: productData.images,
    },
    twitter: {
      card: "summary_large_image",
      title: productData.title,
      description: productData.description,
      images: productData.images[0],
    },
  };
}

function isVariantArray(val: unknown): val is Variant[] {
  return (
    Array.isArray(val) &&
    val.every(
      (v) =>
        typeof v === "object" &&
        v !== null &&
        ("price" in v || "color" in v || "size" in v),
    )
  );
}

function isString(val: unknown): val is string {
  return typeof val === "string";
}

const ProductDiscount = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const productId = (await searchParams).id as string;

  const productData = await api.product.getProductById({ id: productId });

  if (!productData) {
    return <div>Product not found</div>;
  }

  let variants: Variant[] | string | null = null;
  if (isVariantArray(productData.variants)) {
    variants = productData.variants.map((v) => ({ ...v }));
  } else if (isString(productData.variants)) {
    variants = productData.variants;
  } else {
    variants = null;
  }
  const fixedProductData: ProductWithCategory = {
    ...productData,
    variants: variants as unknown as ProductWithCategory["variants"],
  };

  return (
    <>
      <BreadcrumbProduct data={fixedProductData} />
      <ProductDetails productMain={fixedProductData} />
    </>
  );
};

export default ProductDiscount;
