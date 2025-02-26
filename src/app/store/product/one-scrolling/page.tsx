import Grouped from "@/components/store-components/Product/Details/Grouped";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductScrolling = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="grouped"
        productId={productId}
      />
      <Grouped data={productData} productId={productId} />
    </>
  );
};

export default ProductScrolling;
