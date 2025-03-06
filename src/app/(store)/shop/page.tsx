// import productData from "@/data/Product.json";
// import ShopFilterCanvas from "@/components/store-components/Shop/ShopFilterCanvas";
import Footer from "@/components/store-components/Footer";
import ListProduct from "@/components/store-components/Shop/ListProduct";

export default function Fullwidth() {
  // const searchParams = useSearchParams();
  // const type = searchParams.get("type");

  return (
    <>
      <ListProduct />
      <Footer />
    </>
  );
}
