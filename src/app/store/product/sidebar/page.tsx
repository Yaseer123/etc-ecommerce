import Sidebar from "@/components/store-components/Product/Details/Sidebar";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductSidebar = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="sidebar"
        productId={productId}
      />
      <Sidebar data={productData} productId={productId} />
    </>
  );
};

export default ProductSidebar;
