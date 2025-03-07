import VariableProduct from "@/components/store-components/Product/Details/VariableProduct";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductVariable = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="variable"
        productId={productId}
      />
      <VariableProduct data={productData} productId={productId} />
    </>
  );
};

export default ProductVariable;
