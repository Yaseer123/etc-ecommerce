import Default from "@/components/store-components/Product/Details/Default";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductThumbnailLeft = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="thumbnail-left"
        productId={productId}
      />
      <Default data={productData} productId={productId} />
    </>
  );
};

export default ProductThumbnailLeft;
