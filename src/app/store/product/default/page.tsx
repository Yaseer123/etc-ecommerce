import Default from "@/components/store-components/Product/Details/Default";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductDefault = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="default"
        productId={productId}
      />
      <Default data={productData} productId={productId} />
    </>
  );
};

export default ProductDefault;
