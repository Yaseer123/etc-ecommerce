import Sale from "@/components/store-components/Product/Details/Sale";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductSale = ({ searchParams }: { searchParams: { id?: string } }) => {
  const productId = searchParams?.id ?? "1"; // Directly access searchParams from props

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage='sale'
        productId={productId}
      />
      <Sale data={productData} productId={productId} />
    </>
  );
};

export default ProductSale;
