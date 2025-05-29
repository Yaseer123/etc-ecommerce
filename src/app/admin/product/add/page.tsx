export const dynamic = "force-dynamic";
import AddProductForm from "@/components/admin-components/AddProduct";

export default function AddProduct() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-10">
      <AddProductForm />
    </div>
  );
}
