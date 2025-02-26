import Sale from "@/components/store-components/Product/Details/Sale";
import ProductLayout from "../layout";
import productData from "@/data/Product.json";

const ProductSale = ({ searchParams }: { searchParams: { id?: string } }) => {
  const productId = searchParams?.id ?? "1";
  return (
    <ProductLayout productPage="sale">
      <Sale data={productData} productId={productId} />
    </ProductLayout>
  );
};

export default ProductSale;
