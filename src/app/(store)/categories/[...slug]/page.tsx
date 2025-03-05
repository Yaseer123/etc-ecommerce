import productData from "@/data/Product.json";
import ShopBreadCrumb1 from "@/components/store-components/Shop/ShopBreadCrumb1";
import Menu from "@/components/store-components/Menu";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";

export default async function BreadCrumb1({
  params,
  searchParams,
}: {
  searchParams: { type?: string; gender?: string; category?: string };
  params: { slug: string[] };
}) {
  const type = searchParams.type;
  const gender = searchParams.gender;
  const category = searchParams.category;
  
  return (
    <>
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
      </div>

      <ShopBreadCrumb1
        data={productData}
        productPerPage={9}
        dataType={type}
        gender={gender ?? null}
        category={category ?? null}
        slug={params.slug}
      />
    </>
  );
}
