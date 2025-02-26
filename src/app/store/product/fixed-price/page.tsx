import FixedPrice from "@/components/store-components/Product/Details/FixedPrice";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductFixedPrice = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="fixed-price"
        productId={productId}
      />
      <FixedPrice data={productData} productId={productId} />
    </>
  );
};

export default ProductFixedPrice;
