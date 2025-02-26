import Sale from "@/components/store-components/Product/Details/Sale";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductThumbnailBottom = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="thumbnail-bottom"
        productId={productId}
      />
      <Sale data={productData} productId={productId} />
    </>
  );
};

export default ProductThumbnailBottom;
