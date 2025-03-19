import ProductDetails from "@/components/store-components/Product/Details/ProductDetails";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";
import { api } from "@/trpc/server";

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
    title: productData.name,
    description: productData.description,
    openGraph: {
      title: productData.name,
      description: productData.description,
      images: productData.images,
    },
    twitter: {
      card: "summary_large_image",
      title: productData.name,
      description: productData.description,
      images: productData.images[0],
    },
  };
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

  return (
    <>
      <BreadcrumbProduct data={productData} />
      <ProductDetails productMain={productData} />
    </>
  );
};

export default ProductDiscount;
