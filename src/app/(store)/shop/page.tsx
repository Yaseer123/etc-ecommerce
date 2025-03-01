import Menu from "@/components/store-components/Menu";
import ShopBreadCrumbImg from "@/components/store-components/Shop/ShopBreadCrumbImg";
import { useSearchParams } from "next/navigation";
import productData from "@/data/Product.json";
export default function Page() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  return (
    <>
     
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
