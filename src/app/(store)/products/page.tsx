import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import ShopFilterCanvas from "@/components/store-components/Shop/ShopFilterCanvas";
import { api } from "@/trpc/server";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const category = (await searchParams).category as string;
  const productData = await api.product.getAllPretty(category ?? "");

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "products",
      href: "/products",
    },
  ];

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} pageTitle="Shop" />
      <ShopFilterCanvas
        data={productData}
        productPerPage={12}
        // productStyle="style-1"
      />
    </>
  );
}
