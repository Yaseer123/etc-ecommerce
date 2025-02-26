import VariableProduct from "@/components/store-components/Product/Details/VariableProduct";
import ProductLayout from "../layout";
import productData from "@/data/Product.json";

const ProductCombined = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";
  return (
    <ProductLayout productPage="variable">
      <VariableProduct data={productData} productId={productId} />
    </ProductLayout>
  );
};

export default ProductCombined;
