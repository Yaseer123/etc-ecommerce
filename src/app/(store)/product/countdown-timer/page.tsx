import CountdownTimer from "@/components/store-components/Product/Details/CountdownTimer";
import productData from "@/data/Product.json";
import BreadcrumbProduct from "@/components/store-components/Breadcrumb/BreadcrumbProduct";

const ProductCountdownTimer = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const productId = searchParams?.id ?? "1";

  return (
    <>
      <BreadcrumbProduct
        data={productData}
        productPage="countdown-timer"
        productId={productId}
      />
      <CountdownTimer data={productData} productId={productId} />
    </>
  );
};

export default ProductCountdownTimer;
