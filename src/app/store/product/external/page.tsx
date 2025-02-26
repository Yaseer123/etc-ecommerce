import External from "@/components/store-components/Product/Details/External";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductExternal = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="external"
        productId={productId}
      />
      <External data={productData} productId={productId} />
    </>
  );
};

export default ProductExternal;
