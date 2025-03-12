import Footer from "@/components/store-components/Footer";
import ListProduct from "@/components/store-components/Shop/ListProduct";

export default function ProductsPage() {
  // const searchParams = useSearchParams();
  // const type = searchParams.get("type");

  return (
    <>
      <ListProduct />
      <Footer />
    </>
  );
}
