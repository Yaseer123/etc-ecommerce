import Discount from "@/components/store-components/Product/Details/Discount";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductDiscount = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="discount"
        productId={productId}
      />
      <Discount data={productData} productId={productId} />
    </>
  );
};

export default ProductDiscount;
