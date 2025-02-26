import OutOfStock from "@/components/store-components/Product/Details/OutOfStock";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductOutOfStock = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="out-of-stock"
        productId={productId}
      />
      <OutOfStock data={productData} productId={productId} />
    </>
  );
};

export default ProductOutOfStock;
