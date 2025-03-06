import VariableProduct from "@/components/store-components/Product/Details/VariableProduct";
import productData from "@/data/Product.json";

const ProductCombined = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";
  return <VariableProduct data={productData} productId={productId} />;
};

export default ProductCombined;
