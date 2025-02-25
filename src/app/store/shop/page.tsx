import Menu from "@/components/store-components/Menu";
import ShopBreadCrumbImg from "@/components/store-components/Shop/ShopBreadCrumbImg";
import TopNav from "@/components/store-components/TopNav";
import { useSearchParams } from "next/navigation";
import productData from "@/data/Product.json";
export default function Page() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  return (
    <>
      <TopNav
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
      </div>
      <ShopBreadCrumbImg
        data={productData}
        productPerPage={12}
        dataType={type}
      />
    </>
  );
}
