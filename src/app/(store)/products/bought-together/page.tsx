import BoughtTogether from "@/components/store-components/Product/Details/BoughtTogether";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";
const ProductBoughtTogether = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";
  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="bought-together"
        productId={productId}
      />
      <BoughtTogether data={productData} productId={productId} />
    </>
  );
};

export default ProductBoughtTogether;
